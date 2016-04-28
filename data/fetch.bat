tidy -xml -asxml -o a.xml gs1datakart.products.pilot.xml
sed "s/\(https:\/\/.*.jpg\)/<a href=\"\1\">Link<\/a>/g" a.xml > b.xml