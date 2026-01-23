import { useState, useEffect } from 'react';
import { Plus, Play, Pause, Trophy, BarChart3, Trash2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import AdminGuard from '@/components/AdminGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';

interface ABTest {
  id: string;
  name: string;
  description: string | null;
  test_type: string;
  variants: any;
  traffic_split: any;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  winner_variant: string | null;
  created_at: string;
}

interface TestStats {
  test_id: string;
  variant: string;
  impressions: number;
  conversions: number;
  conversion_rate: number;
}

const ABTests = () => {
  const { language } = useLanguage();
  const [tests, setTests] = useState<ABTest[]>([]);
  const [testStats, setTestStats] = useState<Record<string, TestStats[]>>({});
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [newTest, setNewTest] = useState({
    name: '',
    description: '',
    test_type: 'content',
    variant_a: '',
    variant_b: '',
    split_a: 50,
    split_b: 50,
  });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    const { data, error } = await supabase
      .from('ab_tests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tests:', error);
    } else {
      setTests(data || []);

      // Fetch stats for each test
      for (const test of data || []) {
        const { data: impressions } = await supabase
          .from('ab_test_impressions')
          .select('variant, converted')
          .eq('test_id', test.id);

        if (impressions) {
          const stats: Record<string, { impressions: number; conversions: number }> = {};
          impressions.forEach((imp) => {
            if (!stats[imp.variant]) {
              stats[imp.variant] = { impressions: 0, conversions: 0 };
            }
            stats[imp.variant].impressions++;
            if (imp.converted) {
              stats[imp.variant].conversions++;
            }
          });

          const statsArray: TestStats[] = Object.entries(stats).map(([variant, data]) => ({
            test_id: test.id,
            variant,
            impressions: data.impressions,
            conversions: data.conversions,
            conversion_rate:
              data.impressions > 0 ? (data.conversions / data.impressions) * 100 : 0,
          }));

          setTestStats((prev) => ({ ...prev, [test.id]: statsArray }));
        }
      }
    }
    setLoading(false);
  };

  const handleCreateTest = async () => {
    if (!newTest.name || !newTest.variant_a || !newTest.variant_b) {
      toast.error(language === 'de' ? 'Bitte alle Felder ausfüllen' : 'Please fill all fields');
      return;
    }

    const { error } = await supabase.from('ab_tests').insert({
      name: newTest.name,
      description: newTest.description,
      test_type: newTest.test_type,
      variants: [
        { name: 'control', value: newTest.variant_a },
        { name: 'variant', value: newTest.variant_b },
      ],
      traffic_split: { control: newTest.split_a, variant: newTest.split_b },
    });

    if (error) {
      toast.error(language === 'de' ? 'Fehler beim Erstellen' : 'Error creating test');
    } else {
      toast.success(language === 'de' ? 'Test erstellt!' : 'Test created!');
      setDialogOpen(false);
      setNewTest({
        name: '',
        description: '',
        test_type: 'content',
        variant_a: '',
        variant_b: '',
        split_a: 50,
        split_b: 50,
      });
      fetchTests();
    }
  };

  const toggleTest = async (test: ABTest) => {
    const { error } = await supabase
      .from('ab_tests')
      .update({
        is_active: !test.is_active,
        start_date: !test.is_active ? new Date().toISOString() : test.start_date,
      })
      .eq('id', test.id);

    if (error) {
      toast.error(language === 'de' ? 'Fehler beim Aktualisieren' : 'Error updating test');
    } else {
      toast.success(
        test.is_active
          ? language === 'de'
            ? 'Test pausiert'
            : 'Test paused'
          : language === 'de'
          ? 'Test gestartet'
          : 'Test started'
      );
      fetchTests();
    }
  };

  const declareWinner = async (testId: string, variant: string) => {
    const { error } = await supabase
      .from('ab_tests')
      .update({
        winner_variant: variant,
        is_active: false,
        end_date: new Date().toISOString(),
      })
      .eq('id', testId);

    if (error) {
      toast.error(language === 'de' ? 'Fehler' : 'Error');
    } else {
      toast.success(language === 'de' ? 'Gewinner festgelegt!' : 'Winner declared!');
      fetchTests();
    }
  };

  const deleteTest = async (id: string) => {
    const { error } = await supabase.from('ab_tests').delete().eq('id', id);
    if (error) {
      toast.error(language === 'de' ? 'Fehler beim Löschen' : 'Error deleting');
    } else {
      toast.success(language === 'de' ? 'Test gelöscht' : 'Test deleted');
      fetchTests();
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <SEO title="A/B Tests" />
        <Header />

        <main className="container max-w-6xl mx-auto py-8 px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">A/B Tests</h1>
              <p className="text-muted-foreground">
                {language === 'de'
                  ? 'Teste verschiedene Varianten'
                  : 'Test different variants'}
              </p>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  {language === 'de' ? 'Neuer Test' : 'New Test'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>
                    {language === 'de' ? 'Neuen A/B Test erstellen' : 'Create New A/B Test'}
                  </DialogTitle>
                  <DialogDescription>
                    {language === 'de'
                      ? 'Teste verschiedene Inhalte oder Layouts'
                      : 'Test different content or layouts'}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={newTest.name}
                      onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                      placeholder="z.B. Homepage CTA Test"
                    />
                  </div>

                  <div>
                    <Label>{language === 'de' ? 'Beschreibung' : 'Description'}</Label>
                    <Textarea
                      value={newTest.description}
                      onChange={(e) =>
                        setNewTest({ ...newTest, description: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>{language === 'de' ? 'Test-Typ' : 'Test Type'}</Label>
                    <Select
                      value={newTest.test_type}
                      onValueChange={(v) => setNewTest({ ...newTest, test_type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="content">Content</SelectItem>
                        <SelectItem value="price">Price</SelectItem>
                        <SelectItem value="layout">Layout</SelectItem>
                        <SelectItem value="cta">CTA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Variante A (Control)</Label>
                      <Textarea
                        value={newTest.variant_a}
                        onChange={(e) =>
                          setNewTest({ ...newTest, variant_a: e.target.value })
                        }
                        placeholder="Original"
                      />
                    </div>
                    <div>
                      <Label>Variante B</Label>
                      <Textarea
                        value={newTest.variant_b}
                        onChange={(e) =>
                          setNewTest({ ...newTest, variant_b: e.target.value })
                        }
                        placeholder="Alternative"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Traffic A (%)</Label>
                      <Input
                        type="number"
                        value={newTest.split_a}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setNewTest({
                            ...newTest,
                            split_a: val,
                            split_b: 100 - val,
                          });
                        }}
                        min={0}
                        max={100}
                      />
                    </div>
                    <div>
                      <Label>Traffic B (%)</Label>
                      <Input
                        type="number"
                        value={newTest.split_b}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setNewTest({
                            ...newTest,
                            split_b: val,
                            split_a: 100 - val,
                          });
                        }}
                        min={0}
                        max={100}
                      />
                    </div>
                  </div>

                  <Button onClick={handleCreateTest} className="w-full">
                    {language === 'de' ? 'Test erstellen' : 'Create Test'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tests Grid */}
          <div className="grid gap-6">
            {loading ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  {language === 'de' ? 'Lade Tests...' : 'Loading tests...'}
                </CardContent>
              </Card>
            ) : tests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{language === 'de' ? 'Keine Tests vorhanden' : 'No tests yet'}</p>
                </CardContent>
              </Card>
            ) : (
              tests.map((test) => {
                const stats = testStats[test.id] || [];
                return (
                  <Card key={test.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {test.name}
                            <Badge variant={test.is_active ? 'default' : 'secondary'}>
                              {test.is_active
                                ? language === 'de'
                                  ? 'Aktiv'
                                  : 'Active'
                                : language === 'de'
                                ? 'Pausiert'
                                : 'Paused'}
                            </Badge>
                            {test.winner_variant && (
                              <Badge variant="outline" className="gap-1">
                                <Trophy className="w-3 h-3" />
                                {test.winner_variant}
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription>{test.description}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => toggleTest(test)}
                          >
                            {test.is_active ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => deleteTest(test.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Variante</TableHead>
                            <TableHead className="text-right">Impressions</TableHead>
                            <TableHead className="text-right">Conversions</TableHead>
                            <TableHead className="text-right">Rate</TableHead>
                            <TableHead className="text-right">Aktion</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stats.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center text-muted-foreground">
                                {language === 'de' ? 'Noch keine Daten' : 'No data yet'}
                              </TableCell>
                            </TableRow>
                          ) : (
                            stats.map((stat) => (
                              <TableRow key={stat.variant}>
                                <TableCell className="font-medium">
                                  {stat.variant === 'control' ? 'A (Control)' : 'B (Variant)'}
                                </TableCell>
                                <TableCell className="text-right">{stat.impressions}</TableCell>
                                <TableCell className="text-right">{stat.conversions}</TableCell>
                                <TableCell className="text-right">
                                  {stat.conversion_rate.toFixed(1)}%
                                </TableCell>
                                <TableCell className="text-right">
                                  {!test.winner_variant && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => declareWinner(test.id, stat.variant)}
                                    >
                                      <Trophy className="w-3 h-3 mr-1" />
                                      {language === 'de' ? 'Gewinner' : 'Winner'}
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </main>

        <Footer />
      </div>
    </AdminGuard>
  );
};

export default ABTests;
