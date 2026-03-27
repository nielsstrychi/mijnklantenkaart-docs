# MijnKlantenkaart Documentatie

Dit is de centrale Docusaurus-omgeving die dient als "Single Source of Truth" voor zowel de frontend- als backend-repositories via Git Submodules.

## Hoe te gebruiken als submodule

Voeg deze repository toe aan de frontend- of backend-repository met het volgende commando:

```bash
git submodule add https://github.com/nielsstrychi/mijnklantenkaart-docs.git docs
```

Om de submodule te updaten naar de laatste versie:

```bash
git submodule update --remote
```

Dit zorgt ervoor dat de documentatie altijd up-to-date is binnen beide repositories.
