#!/usr/bin/env bash
set -euo pipefail

# Convert Panasonic RW2 files into JPG files for web usage.
# Usage:
#   ./scripts/convert-rw2.sh
#   ./scripts/convert-rw2.sh --force

FORCE=0
if [[ "${1:-}" == "--force" ]]; then
  FORCE=1
fi

if ! command -v sips >/dev/null 2>&1; then
  echo "Erreur: 'sips' est introuvable. Ce script fonctionne sur macOS." >&2
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
UPLOADS_ROOT="$ROOT_DIR/public/uploads"

if [[ ! -d "$UPLOADS_ROOT" ]]; then
  echo "Aucun dossier uploads trouve: $UPLOADS_ROOT"
  exit 0
fi

converted=0
skipped=0

while IFS= read -r -d '' rw2_file; do
  jpg_file="${rw2_file%.*}.jpg"

  if [[ -f "$jpg_file" && "$FORCE" -ne 1 ]]; then
    echo "SKIP (deja present): $jpg_file"
    skipped=$((skipped + 1))
    continue
  fi

  echo "CONVERT: $rw2_file -> $jpg_file"
  sips -s format jpeg "$rw2_file" --out "$jpg_file" >/dev/null
  converted=$((converted + 1))
done < <(find "$UPLOADS_ROOT" -type f \( -iname '*.rw2' \) -print0)

echo "Termine. Convertis: $converted, Ignorés: $skipped"
