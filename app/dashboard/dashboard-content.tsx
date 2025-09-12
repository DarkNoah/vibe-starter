"use client";

import { ChartAreaInteractive } from "@/app/dashboard/chart-area-interactive";
import { DataTable } from "@/app/dashboard/data-table";
import { SectionCards } from "@/app/dashboard/section-cards";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import data from "./data.json";

export default function DashboardContent() {
  const { t, i18n } = useTranslation();

  return (
    <>
      <div className="px-4 lg:px-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("welcome")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("currentLanguage")}
            </p>
            <p className="mt-2 text-sm">{t("changeLanguage")}</p>
          </CardContent>
        </Card>
      </div>

      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </>
  );
}
