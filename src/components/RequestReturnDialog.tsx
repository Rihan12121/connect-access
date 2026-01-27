import { useMemo, useState } from "react";

import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, RotateCcw } from "lucide-react";

type ReturnReason =
  | "defekt"
  | "falsch"
  | "gefaellt_nicht"
  | "zu_spaet"
  | "sonstiges";

const REASONS: { value: ReturnReason; label: { de: string; en: string } }[] = [
  { value: "defekt", label: { de: "Defekt / beschädigt", en: "Defective / damaged" } },
  { value: "falsch", label: { de: "Falscher Artikel", en: "Wrong item" } },
  { value: "gefaellt_nicht", label: { de: "Gefällt nicht", en: "Changed mind" } },
  { value: "zu_spaet", label: { de: "Zu spät geliefert", en: "Arrived too late" } },
  { value: "sonstiges", label: { de: "Sonstiges", en: "Other" } },
];

export function RequestReturnDialog(props: {
  orderId: string;
  userId: string;
  disabled?: boolean;
  onCreated?: () => void;
}) {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReturnReason>("defekt");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const orderShort = useMemo(() => props.orderId.slice(0, 8).toUpperCase(), [props.orderId]);

  const submit = async () => {
    setSubmitting(true);
    const { error } = await supabase.from("returns").insert({
      order_id: props.orderId,
      user_id: props.userId,
      reason,
      notes: notes.trim() ? notes.trim() : null,
      status: "requested",
    });

    if (error) {
      console.error("Error creating return:", error);
      toast.error(language === "de" ? "Retoure konnte nicht angefordert werden" : "Could not request return");
      setSubmitting(false);
      return;
    }

    toast.success(language === "de" ? "Retoure angefragt" : "Return requested");
    setSubmitting(false);
    setOpen(false);
    setNotes("");
    props.onCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={props.disabled}>
          <RotateCcw className="w-4 h-4 mr-2" />
          {language === "de" ? "Retoure" : "Return"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{language === "de" ? "Retoure anfordern" : "Request a return"}</DialogTitle>
          <DialogDescription>
            {language === "de"
              ? `Für Bestellung #${orderShort}`
              : `For order #${orderShort}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{language === "de" ? "Grund" : "Reason"}</Label>
            <Select value={reason} onValueChange={(v) => setReason(v as ReturnReason)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label[language]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{language === "de" ? "Notiz (optional)" : "Note (optional)"}</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === "de" ? "Kurze Erklärung…" : "Short explanation…"}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
            {language === "de" ? "Abbrechen" : "Cancel"}
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {language === "de" ? "Anfordern" : "Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
