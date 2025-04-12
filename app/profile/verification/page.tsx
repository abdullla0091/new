"use client";

import { useState, useEffect } from "react";
import { VerificationStatus } from "@/components/auth/verification-status";
import { useLanguage } from "@/app/i18n/LanguageContext";
import { getUserSession } from "@/lib/supabase";
import { Loader2, InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function VerificationPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        setLoading(true);
        const session = await getUserSession();
        setEmail(session?.user?.email || null);
      } catch (error) {
        console.error("Error fetching user email:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEmail();
  }, []);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t("verification.title")}</h1>
      
      <Alert variant="default" className="mb-6 bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          {t("verification.infoMessage")} {t("verification.testingNote")}
        </AlertDescription>
      </Alert>
      
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : email ? (
          <VerificationStatus email={email} />
        ) : (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4">
            <p className="text-sm">
              {t("signIn")} {t("verification.unverifiedDescription")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 