# Memory Game Web Anwendung - Anweisungen zur Vorbereitung der Entwicklungsumgebung

Dieses README führt Sie durch die Schritte, die erforderlich sind, um unsere Webanwendung lokal auf Ihrem Computer zu testen.

## Voraussetzungen

Stellen Sie sicher, dass die folgenden Programme auf Ihrem Rechner installiert sind:

- **Docker**: [Download und Installationsanleitung](https://www.docker.com/get-started)
- **Git**: [Download und Installationsanleitung](https://git-scm.com/)

## Anleitung zur Installation und Ausführung

### 1. Repository klonen

Zuerst müssen Sie das Git-Repository auf Ihren lokalen Rechner klonen. Verwenden Sie dafür das folgende Kommando in einem Terminal:

```bash
git clone https://github.com/SafaeKa/Memory--Game
````
Hinweis: Es kann sein, dass Sie nach einem Token gefragt werden. Sollte dies der Fall sein, überprüfen Sie bitte Ihre E-Mail.

### 2. Docker-Container erstellen und starten
Navigieren Sie nach dem Klonen des Repositories in das Verzeichnis, in dem sich die docker-compose.yml-Datei befindet. Führen Sie dort den folgenden Befehl aus, um die Docker-Container zu erstellen und zu starten:
```bash
docker-compose up --build
```
## 3. Ports anpassen (falls notwendig)
Standardmäßig wird die Anwendung auf den Ports `80` und `8080` ausgeführt. Sollten diese Ports auf Ihrem Rechner bereits belegt sein, können Sie die Portnummern wie folgt anpassen:

Öffnen Sie die docker-compose.yml-Datei und ändern Sie die Ports dort entsprechend.

Stellen Sie sicher, dass Sie die Portänderungen ebenfalls in den Dockerfiles für das Frontend und Backend vornehmen, falls erforderlich.

## 4. Anwendung starten und aufrufen
Wenn alle Container erfolgreich gestartet wurden, sollte die Anwendung unter folgender URL erreichbar sein (port 80):
[localhost](http://localhost:80)

## Änderungen im Code
Sollten Sie Änderungen am Code vornehmen, müssen die Docker-Images neu gebaut werden, damit die Änderungen übernommen werden. Dies können Sie wie folgt tun:
```bash
docker-compose up --build
```
## Warum Docker?
Wir haben Docker verwendet, um sicherzustellen, dass alle Abhängigkeiten und Umgebungen bereits vorkonfiguriert sind. Dadurch müssen Sie keine zusätzlichen Pakete oder Bibliotheken manuell installieren – alles wird innerhalb der Container ausgeführt.