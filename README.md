# 🐳 Application Full-Stack Conteneurisée avec Docker

## 📋 Description du Projet

Cette application full-stack démontre la conteneurisation d'une architecture complète utilisant Docker et Docker Compose. Le projet implémente une application web moderne avec persistance des données et communication sécurisée entre services.

### 🎯 Objectifs
- Conteneurisation d'une application complète (Frontend + Backend + Base de données)
- Orchestration des services avec Docker Compose
- Configuration de la persistance des données
- Mise en place de réseaux Docker sécurisés
- Déploiement d'images sur Docker Hub

## 🏗️ Architecture Technique

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   PostgreSQL    │
│   React.js      │────│  Node.js/Express│────│   Database      │
│   Port: 3000    │    │   Port: 5000    │    │   Port: 5432    │
│   nginx         │    │                 │    │   (interne)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  mon-reseau     │
                    │  (bridge)       │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │  donnees_db     │
                    │  (volume)       │
                    └─────────────────┘
```

### 🔧 Composants

| Service | Technologie | Port | Rôle |
|---------|-------------|------|------|
| **Frontend** | React.js + Nginx | 3000 | Interface utilisateur |
| **Backend** | Node.js + Express | 5000 | API REST et logique métier |
| **Database** | PostgreSQL 15 | 5432 (interne) | Persistance des données |

### 🌐 Configuration Réseau
- **Réseau personnalisé** : `mon-reseau` (bridge)
- **Communication sécurisée** : Backend ↔ Database isolée
- **Exposition contrôlée** : Seuls les ports nécessaires sont exposés

### 💾 Persistance des Données
- **Volume Docker** : `donnees_db` pour PostgreSQL
- **Localisation** : `/var/lib/postgresql/data`
- **Avantage** : Les données survivent aux redémarrages

## 🚀 Instructions de Déploiement

### Prérequis
- Docker Engine (version 20.10+)
- Docker Compose (version 2.0+)
- Git
- 2GB RAM minimum
- Ports 3000 et 5000 disponibles

### Installation sur Ubuntu/Linux

#### 1. Installer Docker (si nécessaire)
```bash
Mettre à jour le système:
sudo apt update && sudo apt upgrade -y

Installer les dépendances :
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release -y

Ajouter la clé GPG officielle de Docker :
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

Ajouter le repository Docker :
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

Mettre à jour la liste des paquets :
sudo apt update

Installer Docker Engine :
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y

Ajouter votre utilisateur au groupe docker (pour éviter sudo à chaque fois) :
sudo usermod -aG docker $USER

Redémarrer le service Docker :
sudo systemctl enable docker
sudo systemctl start docker

#### 2. Cloner le projet
```bash
git clone https://github.com/yanis78/mon-app-docker.git
cd mon-app-docker
```

#### 3. Démarrage rapide
```bash
docker compose build

# Démarrer tous les services
docker compose up -d

# Vérifier le statut
docker compose ps
```

#### 4. Accès aux services
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:5000/api/test
- **Test Database** : http://localhost:5000/api/db-test

### Déploiement depuis Docker Hub (recommandé)

```bash
# Créer un dossier pour le projet
mkdir mon-app-docker && cd mon-app-docker

# Télécharger uniquement docker-compose.yml
wget https://raw.githubusercontent.com/votre-username/mon-app-docker/main/docker-compose.yml

# Démarrer (utilise les images Docker Hub)
docker compose up -d
```

## 🧪 Guide de Test

### Tests de Communication entre Conteneurs

#### 1. Test de connectivité réseau
```bash
# Vérifier que le backend peut joindre la base de données
docker compose exec backend ping database

# Résultat attendu : réponses ping réussies
PING database (172.20.0.X): 56 data bytes
64 bytes from 172.20.0.X: seq=0 ttl=64 time=0.XXX ms
```

#### 2. Test des APIs
```bash
# Test de l'API backend
curl -s http://localhost:5000/api/test | jq

# Résultat attendu :
{
  "message": "Backend fonctionne !",
  "timestamp": "2024-XX-XXTXX:XX:XX.XXXZ",
  "host": "database"
}

# Test de la connexion base de données
curl -s http://localhost:5000/api/db-test | jq

# Résultat attendu :
{
  "message": "Base de données connectée !",
  "data": {
    "current_time": "2024-XX-XX XX:XX:XX.XXXXXX+00",
    "postgres_version": "PostgreSQL 15.X..."
  }
}
```

#### 3. Test de création de table et données
```bash
# Créer une table avec des données de test
curl -s http://localhost:5000/api/create-table | jq

# Résultat attendu :
{
  "message": "Table créée et remplie !",
  "users": [
    {
      "id": 1,
      "name": "Test User 1",
      "email": "user1@test.com",
      "created_at": "2024-XX-XXTXX:XX:XX.XXXZ"
    }
  ]
}
```

### Tests de Persistance des Données

#### 1. Test de persistance après redémarrage
```bash
# 1. Créer des données
curl http://localhost:5000/api/create-table

# 2. Redémarrer les conteneurs
docker compose restart

# 3. Attendre le redémarrage (30 secondes)
sleep 30

# 4. Vérifier que les données existent toujours
curl http://localhost:5000/api/create-table

# Les utilisateurs créés précédemment doivent toujours être présents
```

#### 2. Test de persistance après arrêt complet
```bash
# 1. Arrêter tous les services
docker compose down

# 2. Redémarrer
docker compose up -d

# 3. Vérifier la persistance
curl http://localhost:5000/api/db-test
```

#### 3. Accès direct à la base de données
```bash
# Se connecter à PostgreSQL
docker compose exec database psql -U admin -d mon_app

# Commandes SQL de test
\dt                          # Lister les tables
SELECT * FROM users;         # Voir les données
\q                          # Quitter
```

### Tests de Performance et Monitoring

#### 1. Surveillance des ressources
```bash
# Voir l'utilisation des ressources en temps réel
docker stats

# Résultat type :
CONTAINER ID   NAME           CPU %     MEM USAGE / LIMIT     MEM %
xxxxx          mon-frontend   0.02%     12.1MiB / 7.775GiB    0.15%
xxxxx          mon-backend    0.15%     45.2MiB / 7.775GiB    0.57%
xxxxx          ma-db          0.25%     78.5MiB / 7.775GiB    0.99%
```

#### 2. Vérification des logs
```bash
# Logs de tous les services
docker compose logs -f

# Logs d'un service spécifique
docker compose logs backend
docker compose logs frontend
docker compose logs database
```

#### 3. Healthchecks
```bash
# Vérifier l'état de santé des conteneurs
docker compose ps

# Statut attendu : "healthy" pour tous les services
```

## 🔧 Commandes Utiles

### Gestion des Services

```bash
# Démarrer tous les services
docker compose up -d

# Arrêter tous les services
docker compose down

# Redémarrer un service spécifique
docker compose restart backend

# Voir les logs en temps réel
docker compose logs -f

# Reconstruire et redémarrer
docker compose down
docker compose build --no-cache
docker compose up -d
```
## 📁 Structure du Projet

```
mon-app-docker/
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js
│       └── index.js
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── docker-compose.yml
├── .env
├── .gitignore
├── README.md
```

## 🔗 Liens Utiles

- **Repository Git** : https://github.com/YanisB789/mon-app-docker
- **Images Docker Hub** :
  - Backend : https://hub.docker.com/r/yanis78/mon-backend
  - Frontend : https://hub.docker.com/r/yanis78/mon-frontend
- **Documentation Docker** : https://docs.docker.com/
- **Documentation Docker Compose** : https://docs.docker.com/compose/

## 👥 Contributeurs

- **Yanis**
- **Alexandre**
- **Marco**

