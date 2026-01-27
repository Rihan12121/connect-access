export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ab_test_impressions: {
        Row: {
          conversion_value: number | null
          converted: boolean
          created_at: string
          id: string
          session_id: string
          test_id: string
          user_id: string | null
          variant: string
        }
        Insert: {
          conversion_value?: number | null
          converted?: boolean
          created_at?: string
          id?: string
          session_id: string
          test_id: string
          user_id?: string | null
          variant: string
        }
        Update: {
          conversion_value?: number | null
          converted?: boolean
          created_at?: string
          id?: string
          session_id?: string
          test_id?: string
          user_id?: string | null
          variant?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_test_impressions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "ab_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_tests: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean
          name: string
          start_date: string | null
          target_entity: string | null
          target_id: string | null
          test_type: string
          traffic_split: Json
          updated_at: string
          variants: Json
          winner_variant: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          name: string
          start_date?: string | null
          target_entity?: string | null
          target_id?: string | null
          test_type?: string
          traffic_split?: Json
          updated_at?: string
          variants?: Json
          winner_variant?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          name?: string
          start_date?: string | null
          target_entity?: string | null
          target_id?: string | null
          test_type?: string
          traffic_split?: Json
          updated_at?: string
          variants?: Json
          winner_variant?: string | null
        }
        Relationships: []
      }
      affiliate_payouts: {
        Row: {
          affiliate_id: string
          amount: number
          created_at: string
          id: string
          payment_details: Json | null
          payment_method: string | null
          processed_at: string | null
          processed_by: string | null
          status: string
        }
        Insert: {
          affiliate_id: string
          amount: number
          created_at?: string
          id?: string
          payment_details?: Json | null
          payment_method?: string | null
          processed_at?: string | null
          processed_by?: string | null
          status?: string
        }
        Update: {
          affiliate_id?: string
          amount?: number
          created_at?: string
          id?: string
          payment_details?: Json | null
          payment_method?: string | null
          processed_at?: string | null
          processed_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_payouts_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_referrals: {
        Row: {
          affiliate_id: string
          clicked_at: string
          commission_amount: number | null
          converted_at: string | null
          id: string
          order_id: string | null
          status: string
          visitor_ip: string | null
        }
        Insert: {
          affiliate_id: string
          clicked_at?: string
          commission_amount?: number | null
          converted_at?: string | null
          id?: string
          order_id?: string | null
          status?: string
          visitor_ip?: string | null
        }
        Update: {
          affiliate_id?: string
          clicked_at?: string
          commission_amount?: number | null
          converted_at?: string | null
          id?: string
          order_id?: string | null
          status?: string
          visitor_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_referrals_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          code: string
          commission_rate: number
          created_at: string
          id: string
          pending_payout: number
          status: string
          total_earnings: number
          total_paid: number
          updated_at: string
          user_id: string
        }
        Insert: {
          code: string
          commission_rate?: number
          created_at?: string
          id?: string
          pending_payout?: number
          status?: string
          total_earnings?: number
          total_paid?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          code?: string
          commission_rate?: number
          created_at?: string
          id?: string
          pending_payout?: number
          status?: string
          total_earnings?: number
          total_paid?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          user_id: string
          user_role: string
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_id: string
          user_role: string
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_id?: string
          user_role?: string
        }
        Relationships: []
      }
      blocked_users: {
        Row: {
          bank_account: string | null
          blocked_by: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          reason: string | null
        }
        Insert: {
          bank_account?: string | null
          blocked_by?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          reason?: string | null
        }
        Update: {
          bank_account?: string | null
          blocked_by?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          reason?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          icon: string
          id: string
          image: string
          is_active: boolean
          name: string
          position: number
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          icon?: string
          id?: string
          image: string
          is_active?: boolean
          name: string
          position?: number
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          image?: string
          is_active?: boolean
          name?: string
          position?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          participant_1: string
          participant_2: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          participant_1: string
          participant_2: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          participant_1?: string
          participant_2?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_segments: {
        Row: {
          created_at: string
          description: string | null
          discount_percentage: number | null
          id: string
          is_active: boolean
          min_orders: number | null
          min_total_spent: number | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          id?: string
          is_active?: boolean
          min_orders?: number | null
          min_total_spent?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          id?: string
          is_active?: boolean
          min_orders?: number | null
          min_total_spent?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      discount_codes: {
        Row: {
          code: string
          created_at: string
          description: string | null
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean
          max_uses: number | null
          min_order_amount: number | null
          updated_at: string
          uses_count: number
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          discount_type: string
          discount_value: number
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_order_amount?: number | null
          updated_at?: string
          uses_count?: number
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_order_amount?: number | null
          updated_at?: string
          uses_count?: number
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      gdpr_requests: {
        Row: {
          completed_at: string | null
          created_at: string
          download_url: string | null
          expires_at: string | null
          id: string
          request_type: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          download_url?: string | null
          expires_at?: string | null
          id?: string
          request_type: string
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          download_url?: string | null
          expires_at?: string | null
          id?: string
          request_type?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      hero_banners: {
        Row: {
          created_at: string
          id: string
          image: string
          is_active: boolean
          link: string
          position: number
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image: string
          is_active?: boolean
          link?: string
          position?: number
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image?: string
          is_active?: boolean
          link?: string
          position?: number
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          created_at: string
          id: string
          invoice_number: string
          order_id: string
          pdf_url: string | null
          sent_at: string | null
          status: string
          subtotal: number
          total: number
          updated_at: string
          user_id: string
          vat_amount: number
        }
        Insert: {
          created_at?: string
          id?: string
          invoice_number: string
          order_id: string
          pdf_url?: string | null
          sent_at?: string | null
          status?: string
          subtotal: number
          total: number
          updated_at?: string
          user_id: string
          vat_amount: number
        }
        Update: {
          created_at?: string
          id?: string
          invoice_number?: string
          order_id?: string
          pdf_url?: string | null
          sent_at?: string | null
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string
          vat_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      order_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          order_id: string
          processed: boolean
          processed_at: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          order_id: string
          processed?: boolean
          processed_at?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          order_id?: string
          processed?: boolean
          processed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price: number
          product_id: string
          product_image: string | null
          product_name: string
          quantity: number
          seller_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price: number
          product_id: string
          product_image?: string | null
          product_name: string
          quantity?: number
          seller_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          product_image?: string | null
          product_name?: string
          quantity?: number
          seller_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          cancel_reason: string | null
          cancelled_at: string | null
          created_at: string
          id: string
          payment_intent_id: string | null
          payment_status: string | null
          shipping_address: Json
          status: string
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          id?: string
          payment_intent_id?: string | null
          payment_status?: string | null
          shipping_address: Json
          status?: string
          total: number
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          id?: string
          payment_intent_id?: string | null
          payment_status?: string | null
          shipping_address?: Json
          status?: string
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          metric_name: string
          metric_type: string
          metric_value: number
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_type: string
          metric_value: number
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_type?: string
          metric_value?: number
        }
        Relationships: []
      }
      platform_metrics: {
        Row: {
          id: string
          metadata: Json | null
          metric_name: string
          metric_type: string
          metric_value: number
          recorded_at: string
          threshold_critical: number | null
          threshold_warning: number | null
        }
        Insert: {
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_type: string
          metric_value: number
          recorded_at?: string
          threshold_critical?: number | null
          threshold_warning?: number | null
        }
        Update: {
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_type?: string
          metric_value?: number
          recorded_at?: string
          threshold_critical?: number | null
          threshold_warning?: number | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          discount: number | null
          id: string
          image: string
          images: string[] | null
          in_stock: boolean
          low_stock_threshold: number | null
          name: string
          original_price: number | null
          price: number
          seller_id: string | null
          stock_quantity: number | null
          subcategory: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          discount?: number | null
          id?: string
          image: string
          images?: string[] | null
          in_stock?: boolean
          low_stock_threshold?: number | null
          name: string
          original_price?: number | null
          price: number
          seller_id?: string | null
          stock_quantity?: number | null
          subcategory?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          discount?: number | null
          id?: string
          image?: string
          images?: string[] | null
          in_stock?: boolean
          low_stock_threshold?: number | null
          name?: string
          original_price?: number | null
          price?: number
          seller_id?: string | null
          stock_quantity?: number | null
          subcategory?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string
          display_name: string | null
          id: string
          postal_code: string | null
          street_address: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          postal_code?: string | null
          street_address?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          postal_code?: string | null
          street_address?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          endpoint: string
          id: string
          identifier: string
          request_count: number
          window_start: string
        }
        Insert: {
          endpoint: string
          id?: string
          identifier: string
          request_count?: number
          window_start?: string
        }
        Update: {
          endpoint?: string
          id?: string
          identifier?: string
          request_count?: number
          window_start?: string
        }
        Relationships: []
      }
      refunds: {
        Row: {
          amount: number
          created_at: string
          id: string
          order_id: string
          processed_at: string | null
          processed_by: string | null
          reason: string | null
          status: string
          stripe_refund_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          order_id: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          status?: string
          stripe_refund_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          order_id?: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          status?: string
          stripe_refund_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "refunds_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      returns: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          order_id: string
          processed_at: string | null
          processed_by: string | null
          reason: string
          refund_amount: number | null
          return_label_url: string | null
          status: string
          tracking_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          order_id: string
          processed_at?: string | null
          processed_by?: string | null
          reason: string
          refund_amount?: number | null
          return_label_url?: string | null
          status?: string
          tracking_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string
          refund_amount?: number | null
          return_label_url?: string | null
          status?: string
          tracking_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "returns_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          content: string
          created_at: string
          id: string
          product_id: string
          rating: number
          title: string
          updated_at: string
          user_id: string
          user_name: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          product_id: string
          rating: number
          title: string
          updated_at?: string
          user_id: string
          user_name?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          title?: string
          updated_at?: string
          user_id?: string
          user_name?: string | null
        }
        Relationships: []
      }
      search_analytics: {
        Row: {
          clicked_product_id: string | null
          created_at: string
          id: string
          query: string
          results_count: number
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          clicked_product_id?: string | null
          created_at?: string
          id?: string
          query: string
          results_count?: number
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          clicked_product_id?: string | null
          created_at?: string
          id?: string
          query?: string
          results_count?: number
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      seller_disputes: {
        Row: {
          buyer_id: string
          created_at: string
          description: string | null
          id: string
          order_id: string
          reason: string
          resolution: string | null
          resolved_at: string | null
          resolved_by: string | null
          seller_id: string
          status: string
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          description?: string | null
          id?: string
          order_id: string
          reason: string
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          seller_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string
          reason?: string
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          seller_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seller_disputes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_payouts: {
        Row: {
          amount: number
          bank_details: Json | null
          created_at: string
          id: string
          net_amount: number
          order_id: string | null
          payout_method: string | null
          platform_fee: number
          processed_at: string | null
          scheduled_for: string | null
          seller_id: string
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          bank_details?: Json | null
          created_at?: string
          id?: string
          net_amount: number
          order_id?: string | null
          payout_method?: string | null
          platform_fee?: number
          processed_at?: string | null
          scheduled_for?: string | null
          seller_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          bank_details?: Json | null
          created_at?: string
          id?: string
          net_amount?: number
          order_id?: string | null
          payout_method?: string | null
          platform_fee?: number
          processed_at?: string | null
          scheduled_for?: string | null
          seller_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      seller_ratings: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          is_verified_purchase: boolean | null
          order_id: string | null
          rating: number
          seller_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          is_verified_purchase?: boolean | null
          order_id?: string | null
          rating: number
          seller_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          is_verified_purchase?: boolean | null
          order_id?: string | null
          rating?: number
          seller_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seller_ratings_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_notifications: {
        Row: {
          id: string
          product_id: string
          sent_at: string
          sent_to: string
          stock_level: number
        }
        Insert: {
          id?: string
          product_id: string
          sent_at?: string
          sent_to: string
          stock_level: number
        }
        Update: {
          id?: string
          product_id?: string
          sent_at?: string
          sent_to?: string
          stock_level?: number
        }
        Relationships: [
          {
            foreignKeyName: "stock_notifications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_settings: {
        Row: {
          country_code: string
          country_name: string
          created_at: string
          id: string
          is_active: boolean | null
          is_eu_member: boolean | null
          oss_applicable: boolean | null
          threshold_amount: number | null
          updated_at: string
          vat_rate: number
        }
        Insert: {
          country_code: string
          country_name: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_eu_member?: boolean | null
          oss_applicable?: boolean | null
          threshold_amount?: number | null
          updated_at?: string
          vat_rate: number
        }
        Update: {
          country_code?: string
          country_name?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_eu_member?: boolean | null
          oss_applicable?: boolean | null
          threshold_amount?: number | null
          updated_at?: string
          vat_rate?: number
        }
        Relationships: []
      }
      translations: {
        Row: {
          category: string | null
          created_at: string
          de: string
          en: string
          id: string
          translation_key: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          de: string
          en: string
          id?: string
          translation_key: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          de?: string
          en?: string
          id?: string
          translation_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          notified_at: string | null
          notify_when_available: boolean
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notified_at?: string | null
          notify_when_available?: boolean
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notified_at?: string | null
          notify_when_available?: boolean
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      profiles_public: {
        Row: {
          avatar_url: string | null
          display_name: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          display_name?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          display_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      generate_invoice_number: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_user_blocked: {
        Args: { check_bank?: string; check_email: string; check_name?: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "seller"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user", "seller"],
    },
  },
} as const
