import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const APP_NAME = "Book My Theatre";

function formatSlugTitle(slug) {
  if (!slug) return "";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getPageTitle(pathname) {
  if (pathname === "/") return "Home";
  if (pathname === "/movies") return "Movies";

  const movieTicket = pathname.match(
    /^\/movies\/[^/]+\/([^/]+)\/[^/]+\/ticket$/
  );
  if (movieTicket) {
    return formatSlugTitle(movieTicket[1]) || "Movie Details";
  }

  const seatLayout = pathname.match(
    /^\/movies\/[^/]+\/([^/]+)\/[^/]+\/theater\/[^/]+\/show\/[^/]+\/seat-layout$/
  );
  if (seatLayout) {
    const movie = formatSlugTitle(seatLayout[1]);
    return movie ? `Select Seats - ${movie}` : "Select Seats";
  }

  if (pathname.match(/^\/shows\/[^/]+\/[^/]+\/checkout$/)) {
    return "Checkout";
  }

  const profile = pathname.match(/^\/profile\/[^/]+\/([^/]+)$/);
  if (profile) {
    return profile[1] === "booking" ? "My Bookings" : "Profile";
  }

  return APP_NAME;
}

const DocumentTitle = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const pageTitle = getPageTitle(pathname);
    document.title =
      pageTitle === APP_NAME ? APP_NAME : `${pageTitle} | ${APP_NAME}`;
  }, [pathname]);

  return null;
};

export default DocumentTitle;
