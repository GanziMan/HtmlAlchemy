import { lazy, Suspense } from "react";

const HtmlEditor = lazy(() => import("./HtmlEditor"));
export default function App() {
  return (
    <>
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <div className="loader"></div>
          </div>
        }
      >
        <HtmlEditor />
      </Suspense>
      ;
    </>
  );
}
