install: 
	cd fluence && fluence build
	cd fluence && fluence deal deploy
	cd fluence/gateway && npm run compile
	cp -n indie-frontend/.env.example indie-frontend/.env || true
	docker-compose up -d