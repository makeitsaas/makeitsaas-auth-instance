# Auth instance

Todo:
- explain JWT sign/verify protocole
- implement authentification
- explain getting started, use cases

## Install

```
npm install
cp .env.dist .env
npm start
```


## Generate certificate

```
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
```
