#!/bin/bash

# Replace gold color references with purple in all TypeScript files

# Files to update
files=(
  "./app/privacy/page.tsx"
  "./app/app/page.tsx"
  "./app/terms/page.tsx"
  "./app/admin/page.tsx"
  "./app/page.tsx"
  "./components/WaitlistForm.tsx"
  "./components/NominationForm.tsx"
  "./components/Footer.tsx"
  "./components/CountdownTimer.tsx"
  "./components/Navigation.tsx"
)

# Perform replacements
for file in "${files[@]}"; do
  echo "Updating $file..."
  
  # Replace color classes
  sed -i '' 's/text-gold/text-primary-purple/g' "$file"
  sed -i '' 's/bg-gold/bg-primary-purple/g' "$file"
  sed -i '' 's/border-gold/border-primary-purple/g' "$file"
  sed -i '' 's/hover:bg-gold/hover:bg-primary-purple/g' "$file"
  sed -i '' 's/hover:text-gold/hover:text-primary-purple/g' "$file"
  sed -i '' 's/focus:ring-gold/focus:ring-primary-purple/g' "$file"
  sed -i '' 's/ring-gold/ring-primary-purple/g' "$file"
  
  # Replace dark/light gold variations
  sed -i '' 's/hover:bg-dark-gold/hover:bg-dark-purple/g' "$file"
  sed -i '' 's/bg-dark-gold/bg-dark-purple/g' "$file"
  sed -i '' 's/text-dark-gold/text-dark-purple/g' "$file"
  sed -i '' 's/bg-light-gold/bg-light-purple/g' "$file"
  sed -i '' 's/text-light-gold/text-light-purple/g' "$file"
  
  # Replace gold with opacity
  sed -i '' 's/bg-gold\/10/bg-primary-purple\/10/g' "$file"
  sed -i '' 's/bg-gold\/20/bg-primary-purple\/20/g' "$file"
  sed -i '' 's/bg-gold\/30/bg-primary-purple\/30/g' "$file"
  sed -i '' 's/bg-gold\/50/bg-primary-purple\/50/g' "$file"
  sed -i '' 's/text-gold\/80/text-primary-purple\/80/g' "$file"
  sed -i '' 's/shadow-gold\/20/shadow-primary-purple\/20/g' "$file"
  
  # Replace Gold (capitalized) in text content
  sed -i '' 's/"Gold"/"Purple"/g' "$file"
  sed -i '' 's/>Gold</>Purple</g' "$file"
done

echo "Color update complete!"
