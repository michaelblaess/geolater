export function Datenschutz() {
  return (
    <article className="prose prose-stone mx-auto max-w-3xl px-4 py-10 dark:prose-invert">
      <h1 className="mb-6 text-3xl font-bold">Datenschutzerklärung</h1>

      <p className="text-stone-700 dark:text-stone-300">
        Diese Anwendung ist ein privates Schülerprojekt und kommt ohne Anmeldung,
        Konto oder Tracking aus.
      </p>

      <h2 className="mt-6 text-xl font-semibold">1. Verantwortlicher</h2>
      <p className="text-stone-700 dark:text-stone-300">
        Siehe <a href="#/impressum" className="text-sky-600 hover:underline dark:text-sky-400">Impressum</a>.
      </p>

      <h2 className="mt-6 text-xl font-semibold">2. Welche Daten werden gespeichert?</h2>
      <p className="text-stone-700 dark:text-stone-300">
        Im <code>localStorage</code> deines Browsers werden folgende Angaben gespeichert,
        ausschließlich auf deinem Gerät, ohne Übertragung an uns:
      </p>
      <ul className="list-disc pl-6 text-stone-700 dark:text-stone-300">
        <li>der von dir eingegebene Nickname (optional)</li>
        <li>deine letzten zehn Highscores</li>
        <li>deine Theme-Wahl (hell/dunkel)</li>
      </ul>
      <p className="text-stone-700 dark:text-stone-300">
        Du kannst diese Daten jederzeit über die Browser-Funktion "Daten der Website löschen"
        oder über die Schaltfläche "Liste löschen" auf der Highscore-Seite entfernen.
      </p>

      <h2 className="mt-6 text-xl font-semibold">3. Cookies</h2>
      <p className="text-stone-700 dark:text-stone-300">
        Es werden keine Cookies gesetzt.
      </p>

      <h2 className="mt-6 text-xl font-semibold">4. Drittanbieter</h2>
      <p className="text-stone-700 dark:text-stone-300">
        Beim Aufruf der Seite und im Spielverlauf werden Anfragen an folgende Dienste
        gestellt, wodurch deren Server deine IP-Adresse verarbeiten:
      </p>
      <ul className="list-disc pl-6 text-stone-700 dark:text-stone-300">
        <li>
          <strong>GitHub Pages</strong> (GitHub, Inc., 88 Colin P Kelly Jr St, San Francisco,
          CA 94107, USA) — hostet diese Seite. Datenschutzerklärung:{" "}
          <a href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement" className="text-sky-600 hover:underline dark:text-sky-400" target="_blank" rel="noreferrer">
            docs.github.com
          </a>
        </li>
        <li>
          <strong>OpenFreeMap</strong> (tiles.openfreemap.org) — liefert die Karten-Tiles
          basierend auf OpenStreetMap-Daten. Mehr Infos:{" "}
          <a href="https://openfreemap.org" className="text-sky-600 hover:underline dark:text-sky-400" target="_blank" rel="noreferrer">
            openfreemap.org
          </a>
        </li>
        <li>
          <strong>OpenStreetMap</strong> (Datenquelle der Karten-Tiles, OpenStreetMap Foundation,
          St John's Innovation Centre, Cowley Road, Cambridge CB4 0WS, Vereinigtes Königreich) —
          wird ggf. als Fallback direkt angefragt.{" "}
          <a href="https://wiki.osmfoundation.org/wiki/Privacy_Policy" className="text-sky-600 hover:underline dark:text-sky-400" target="_blank" rel="noreferrer">
            wiki.osmfoundation.org
          </a>
        </li>
      </ul>

      <h2 className="mt-6 text-xl font-semibold">5. Bilder im Spiel</h2>
      <p className="text-stone-700 dark:text-stone-300">
        Die Standortbilder werden direkt aus diesem Projekt-Repository ausgeliefert,
        es gibt keinen externen Bilddienst.
      </p>

      <h2 className="mt-6 text-xl font-semibold">6. Deine Rechte</h2>
      <p className="text-stone-700 dark:text-stone-300">
        Da wir keine personenbezogenen Daten erheben oder speichern, gibt es keine Auskunfts-,
        Löschungs- oder Berichtigungsanforderung an uns. Wende dich für solche Anfragen direkt
        an die oben genannten Drittanbieter.
      </p>
    </article>
  );
}
