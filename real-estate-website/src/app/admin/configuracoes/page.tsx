"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, Button, Input } from "@/components/ui/Button";
import {
  Settings,
  Upload,
  Save,
  AlertCircle,
  CheckCircle,
  Building2,
  Phone,
  Mail,
  MapPin,
  Star,
} from "lucide-react";
import Image from "next/image";
import { Toast } from "@/components/ui/Toast";

interface SiteSettings {
  id?: string;
  owner_name: string;
  owner_photo_url: string;
  owner_bio: string;
  company_name: string;
  company_logo_url: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  google_reviews_link: string;
}

export default function ConfiguracoesPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    owner_name: "",
    owner_photo_url: "",
    owner_bio: "",
    company_name: "",
    company_logo_url: "",
    contact_phone: "",
    contact_email: "",
    contact_address: "",
    google_reviews_link: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingOwnerPhoto, setUploadingOwnerPhoto] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Carregar configurações
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setSettings(data);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = async (file: File) => {
    try {
      setUploadingLogo(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "settings");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erro no upload");

      const data = await response.json();
      setSettings((prev) => ({ ...prev, company_logo_url: data.url }));
      showMessage("success", "Logo enviado com sucesso!");
    } catch (error) {
      showMessage("error", "Erro ao enviar logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleOwnerPhotoUpload = async (file: File) => {
    try {
      setUploadingOwnerPhoto(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "settings");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erro no upload");

      const data = await response.json();
      setSettings((prev) => ({ ...prev, owner_photo_url: data.url }));
      showMessage("success", "Foto enviada com sucesso!");
    } catch (error) {
      showMessage("error", "Erro ao enviar foto");
    } finally {
      setUploadingOwnerPhoto(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error("Erro ao salvar");

      showMessage("success", "Configurações salvas com sucesso!");
      fetchSettings(); // Recarregar para pegar o ID se for a primeira vez
    } catch (error) {
      showMessage("error", "Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-background-tertiary rounded w-1/3"></div>
            <div className="h-96 bg-background-tertiary rounded"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
              <Settings size={32} className="text-accent-primary" />
              Configurações do Site
            </h1>
            <p className="text-text-secondary mt-1">
              Configure as informações da empresa e dados de contato
            </p>
          </div>
          <Button onClick={handleSave} loading={saving} className="gap-2">
            <Save size={16} />
            Salvar Alterações
          </Button>
        </div>

        {/* Informações da Empresa */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
            <Building2 size={20} />
            Informações da Empresa
          </h2>

          <div className="space-y-6">
            {/* Logo da Empresa */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Logo da Empresa
              </label>
              <div className="flex items-center gap-4">
                {settings.company_logo_url ? (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-background-tertiary">
                    <Image
                      src={settings.company_logo_url}
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-lg bg-background-tertiary flex items-center justify-center">
                    <Building2 size={32} className="text-text-muted" />
                  </div>
                )}

                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files && handleLogoUpload(e.target.files[0])
                    }
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      disabled={uploadingLogo}
                      onClick={() =>
                        document.getElementById("logo-upload")?.click()
                      }
                    >
                      <Upload size={14} />
                      {uploadingLogo ? "Enviando..." : "Enviar Logo"}
                    </Button>
                  </label>
                  <p className="text-xs text-text-muted mt-2">
                    PNG ou JPG. Recomendado: 512x512px
                  </p>
                </div>
              </div>
            </div>

            {/* Nome da Empresa */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Nome da Empresa
              </label>
              <Input
                value={settings.company_name}
                onChange={(e) =>
                  handleInputChange("company_name", e.target.value)
                }
                placeholder="Ex: Casa dos Sonhos Imóveis"
              />
            </div>
          </div>
        </Card>

        {/* Informações do Proprietário */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-6">
            Informações do Proprietário
          </h2>

          <div className="space-y-6">
            {/* Foto do Proprietário */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Foto do Proprietário
              </label>
              <div className="flex items-center gap-4">
                {settings.owner_photo_url ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-background-tertiary">
                    <Image
                      src={settings.owner_photo_url}
                      alt="Proprietário"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-background-tertiary flex items-center justify-center">
                    <Building2 size={32} className="text-text-muted" />
                  </div>
                )}

                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files &&
                      handleOwnerPhotoUpload(e.target.files[0])
                    }
                    className="hidden"
                    id="owner-photo-upload"
                  />
                  <label htmlFor="owner-photo-upload">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      disabled={uploadingOwnerPhoto}
                      onClick={() =>
                        document.getElementById("owner-photo-upload")?.click()
                      }
                    >
                      <Upload size={14} />
                      {uploadingOwnerPhoto ? "Enviando..." : "Enviar Foto"}
                    </Button>
                  </label>
                  <p className="text-xs text-text-muted mt-2">
                    JPG ou PNG. Formato quadrado recomendado
                  </p>
                </div>
              </div>
            </div>

            {/* Nome do Proprietário */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Nome do Proprietário
              </label>
              <Input
                value={settings.owner_name}
                onChange={(e) =>
                  handleInputChange("owner_name", e.target.value)
                }
                placeholder="Ex: João Silva"
              />
            </div>

            {/* Bio do Proprietário */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Biografia
              </label>
              <textarea
                value={settings.owner_bio}
                onChange={(e) => handleInputChange("owner_bio", e.target.value)}
                placeholder="Conte um pouco sobre você e sua experiência no mercado imobiliário..."
                className="w-full min-h-[120px] px-4 py-3 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent resize-none"
              />
            </div>
          </div>
        </Card>

        {/* Dados de Contato */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-6">
            Dados de Contato
          </h2>

          <div className="space-y-6">
            {/* Telefone */}
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 flex items-center gap-2">
                <Phone size={16} />
                Telefone
              </label>
              <Input
                value={settings.contact_phone}
                onChange={(e) =>
                  handleInputChange("contact_phone", e.target.value)
                }
                placeholder="Ex: (85) 99999-9999"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 flex items-center gap-2">
                <Mail size={16} />
                Email
              </label>
              <Input
                type="email"
                value={settings.contact_email}
                onChange={(e) =>
                  handleInputChange("contact_email", e.target.value)
                }
                placeholder="Ex: contato@casadossonhos.com.br"
              />
            </div>

            {/* Endereço */}
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 flex items-center gap-2">
                <MapPin size={16} />
                Endereço
              </label>
              <Input
                value={settings.contact_address}
                onChange={(e) =>
                  handleInputChange("contact_address", e.target.value)
                }
                placeholder="Ex: Rua das Flores, 123 - Centro"
              />
            </div>
          </div>
        </Card>

        {/* Google Reviews */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
            <Star size={20} />
            Google Reviews
          </h2>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Link do Google Reviews
            </label>
            <Input
              value={settings.google_reviews_link}
              onChange={(e) =>
                handleInputChange("google_reviews_link", e.target.value)
              }
              placeholder="Ex: https://g.page/r/..."
            />
            <p className="text-xs text-text-muted mt-2">
              Cole o link da sua página de avaliações do Google
            </p>
          </div>
        </Card>

        {/* Botão de salvar (rodapé) */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            loading={saving}
            size="lg"
            className="gap-2"
          >
            <Save size={16} />
            Salvar Todas as Configurações
          </Button>
        </div>
      </div>
      {/* Toast de notificação */}
      {message && (
        <Toast
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}
    </AdminLayout>
  );
}
