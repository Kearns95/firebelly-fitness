import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CheckCircle2, XCircle } from "lucide-react";

import { apiFetch } from "@/api/client";
import { loginJWT } from "@/Redux/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Splash from "@/components/common/Splash";

export default function VerifyEmailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token");
  const email = params.get("email");

  const [status, setStatus] = useState("verifying"); // verifying | ok | error
  const [message, setMessage] = useState("");
  const [autoLoggedIn, setAutoLoggedIn] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setStatus("error");
      setMessage("This verification link is invalid or incomplete.");
      return;
    }
    let active = true;
    apiFetch(
      `/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`,
      { auth: false }
    )
      .then((data) => {
        if (!active) return;
        if (data?.error) {
          setStatus("error");
          setMessage(
            typeof data.error === "string"
              ? data.error
              : "We couldn't verify your email. The link may have expired."
          );
          return;
        }
        setStatus("ok");
        setMessage(data?.message || "Your email is verified.");
        if (data?.accessToken) {
          dispatch(loginJWT(data.accessToken));
          setAutoLoggedIn(true);
        }
      })
      .catch(() => {
        if (active) {
          setStatus("error");
          setMessage("We couldn't verify your email. Please try again.");
        }
      });
    return () => {
      active = false;
    };
  }, [dispatch, token, email]);

  if (status === "verifying") return <Splash label="Verifying your email…" />;

  const ok = status === "ok";
  return (
    <Card>
      <CardHeader className="items-center text-center">
        {ok ? (
          <CheckCircle2 className="text-primary size-8" aria-hidden="true" />
        ) : (
          <XCircle className="text-destructive size-8" aria-hidden="true" />
        )}
        <CardTitle className="text-xl">
          {ok ? "Email verified" : "Verification failed"}
        </CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent>
        {ok && autoLoggedIn ? (
          <Button className="w-full" onClick={() => navigate("/", { replace: true })}>
            Continue to Firebelly
          </Button>
        ) : (
          <Button asChild variant={ok ? "default" : "outline"} className="w-full">
            <Link to="/login">Go to sign in</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
