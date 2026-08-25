import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match toutes les routes sauf les fichiers statiques et API
    "/((?!api|_next|_vercel|.*\\..*).*)"
  ]
};
