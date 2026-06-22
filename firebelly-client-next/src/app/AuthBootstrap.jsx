import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

import { getAccessToken, requestAccessTokenFromOpenTab } from "@/api/client";
import { loginJWT } from "@/Redux/actions";
import Splash from "@/components/common/Splash";

const isTokenValid = (token) => {
  if (!token) return false;
  try {
    return jwtDecode(token).exp > Date.now() / 1000;
  } catch {
    return false;
  }
};

/**
 * Runs the resume-session sequence ONCE at app start, mirroring the legacy
 * AuthRoute: adopt an in-memory token, else a token from another open tab,
 * else refresh via the httpOnly `fb_refresh` cookie. Blocks the tree with a
 * splash until resolved so route guards can stay synchronous.
 */
export function AuthBootstrap({ children }) {
  const dispatch = useDispatch();
  const hasUser = useSelector((state) => Boolean(state.user?._id));
  const [ready, setReady] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return; // guard StrictMode double-invoke
    ran.current = true;

    const adopt = async (token) => {
      if (!isTokenValid(token)) return false;
      if (!hasUser) await dispatch(loginJWT(token));
      return true;
    };

    (async () => {
      try {
        if (await adopt(getAccessToken())) return;
        if (await adopt(await requestAccessTokenFromOpenTab())) return;
        await dispatch(loginJWT(undefined, { clearOnFailure: true }));
      } finally {
        setReady(true);
      }
    })();
  }, [dispatch, hasUser]);

  if (!ready) return <Splash label="Starting Firebelly…" />;
  return children;
}

export default AuthBootstrap;
