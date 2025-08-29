import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Über uns - BestOfGames",
  description: "Erfahre mehr über BestOfGames und unsere Mission.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-screen-md px-[var(--container-x)] pt-[var(--section-pt)] pb-[var(--section-pb)] 2xl:px-0">
      <h1 className="mb-[var(--space-6)] text-3xl font-bold tracking-tight">Über uns</h1>
      <div className="prose prose-gray dark:prose-invert">
        <p>
          BestOfGames ist eine kuratierte Sammlung von Indie-Spielrezensionen. Wir
          konzentrieren uns auf stilvolle, kurze Einblicke, die dir helfen, deinen
          nächsten Favoriten zu entdecken.
        </p>
        <p>
          Dieses Projekt wurde mit dem Ziel erstellt, moderne Web-Tools zu präsentieren
          und die Leidenschaft für einzigartige Spielerlebnisse zu teilen. Alle Rezensionen
          werden mit Sorgfalt geschrieben und sollen hervorheben, was jedes Spiel
          besonders macht.
        </p>
        <p>
          Du möchtest mit uns in Kontakt treten? Besuche gerne unsere Kontaktseite oder
          folge uns in den sozialen Medien. Wir freuen uns immer über dein Feedback und
          deine Vorschläge.
        </p>
      </div>
    </main>
  );
}

