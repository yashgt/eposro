tidy -xml -asxml -o a.xml gs1datakart.products.pilot.xml
sed "s/\(https:\/\/.*.jpg\)/\1/g" a.xml | grep https | sed "s/<\/.*//g" > b.xml

wget64.exe --no-check-certificate -A jpg -P images -v -d -i b.xml