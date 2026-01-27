-- Add seller_id to order_items so we can attribute each line-item to a seller
ALTER TABLE public.order_items
ADD COLUMN IF NOT EXISTS seller_id uuid;

CREATE INDEX IF NOT EXISTS idx_order_items_order_seller
ON public.order_items(order_id, seller_id);

-- Add order_id to seller_payouts to prevent duplicates and enable auditing
ALTER TABLE public.seller_payouts
ADD COLUMN IF NOT EXISTS order_id uuid;

CREATE INDEX IF NOT EXISTS idx_seller_payouts_order_id
ON public.seller_payouts(order_id);

-- Prevent duplicate payout rows per seller per order
CREATE UNIQUE INDEX IF NOT EXISTS uniq_seller_payouts_order_seller
ON public.seller_payouts(order_id, seller_id);

-- Auto-create seller payout rows (15% platform fee) when an order becomes paid
CREATE OR REPLACE FUNCTION public.create_seller_payouts_on_order_paid()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _commission_rate numeric := 0.15;
BEGIN
  -- Only act when payment_status transitions to 'paid'
  IF NEW.payment_status = 'paid' AND COALESCE(OLD.payment_status, '') <> 'paid' THEN
    -- Ensure trigger can insert regardless of RLS
    PERFORM set_config('row_security', 'off', true);

    INSERT INTO public.seller_payouts (
      seller_id,
      order_id,
      amount,
      platform_fee,
      net_amount,
      status,
      payout_method
    )
    SELECT
      oi.seller_id,
      NEW.id,
      ROUND(SUM(oi.price * oi.quantity)::numeric, 2) AS amount,
      ROUND((SUM(oi.price * oi.quantity) * _commission_rate)::numeric, 2) AS platform_fee,
      ROUND((SUM(oi.price * oi.quantity) * (1 - _commission_rate))::numeric, 2) AS net_amount,
      'pending'::text AS status,
      'bank_transfer'::text AS payout_method
    FROM public.order_items oi
    WHERE oi.order_id = NEW.id
      AND oi.seller_id IS NOT NULL
    GROUP BY oi.seller_id
    ON CONFLICT (order_id, seller_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_create_seller_payouts_on_order_paid ON public.orders;

CREATE TRIGGER trg_create_seller_payouts_on_order_paid
AFTER UPDATE OF payment_status ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.create_seller_payouts_on_order_paid();

-- Harden seller_ratings: prevent direct client inserts (ratings should be created via backend function)
DROP POLICY IF EXISTS "Users can create ratings" ON public.seller_ratings;

CREATE POLICY "No direct seller rating inserts"
ON public.seller_ratings
FOR INSERT
WITH CHECK (false);
