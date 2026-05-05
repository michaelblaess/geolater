export function Impressum() {
  return (
    <article className="prose prose-stone mx-auto max-w-3xl px-4 py-10 dark:prose-invert">
      <h1 className="mb-6 text-3xl font-bold">Impressum</h1>

      <p className="text-stone-700 dark:text-stone-300">
        Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz) und § 18 Abs. 2 MStV
        (Medienstaatsvertrag).
      </p>

      <h2 className="mt-6 text-xl font-semibold">Verantwortlich für den Inhalt</h2>
      <address className="not-italic text-stone-700 dark:text-stone-300">
        Stefan Waßmann
        <br />
        Quellweg 36A
        <br />
        15345 Rehfelde
        <br />
        Deutschland
        <br />
        <br />
        E-Mail: <a href="mailto:st.ar.wassmann@gmx.de" className="text-sky-600 hover:underline dark:text-sky-400">st.ar.wassmann@gmx.de</a>
      </address>

      <h2 className="mt-6 text-xl font-semibold">Hinweis zum Projekt</h2>
      <p className="text-stone-700 dark:text-stone-300">
        Diese Seite ist ein privates Schülerprojekt und wird nicht kommerziell betrieben.
        Es findet keine Werbung, kein Verkauf und kein Sponsoring statt.
      </p>

      <h2 className="mt-6 text-xl font-semibold">Haftung für Inhalte</h2>
      <p className="text-stone-700 dark:text-stone-300">
        Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen
        Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir
        als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte
        fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine
        rechtswidrige Tätigkeit hinweisen.
      </p>

      <h2 className="mt-6 text-xl font-semibold">Haftung für Links</h2>
      <p className="text-stone-700 dark:text-stone-300">
        Diese Seite enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen
        Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr
        übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
        oder Betreiber der Seiten verantwortlich.
      </p>

      <h2 className="mt-6 text-xl font-semibold">Bildnachweise</h2>
      <p className="text-stone-700 dark:text-stone-300">
        Die im Spiel verwendeten Standortbilder sind in der Datei{" "}
        <code>src/data/locations.json</code> im Projekt-Repository mit Quelle und Lizenz
        dokumentiert.
      </p>
    </article>
  );
}
