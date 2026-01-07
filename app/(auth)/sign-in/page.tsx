import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Github } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

type SignInPageProps = {
  searchParams?: {
    callbackUrl?: string;
  };
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  const rawCallbackUrl = searchParams?.callbackUrl;
  const callbackUrl =
    typeof rawCallbackUrl === "string" && rawCallbackUrl.startsWith("/")
      ? rawCallbackUrl
      : "/dashboard";

  return (
    <div className="min-h-[calc(100vh-64px)] px-6 py-16 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <Badge variant="outline" className="w-fit">
            Welcome
          </Badge>
          <CardTitle className="text-2xl">Sign in to {APP_NAME}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Continue with your account to access your dashboard and threads.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: callbackUrl });
            }}
          >
            <Button className="w-full" type="submit">
              <Github className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button>
          </form>
          <Separator />
          <div className="rounded-lg border bg-muted/50 p-4 text-xs text-muted-foreground">
            By continuing, you agree to our terms of service and privacy policy.
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          You can change your connected account later from settings.
        </CardFooter>
      </Card>
    </div>
  );
}
