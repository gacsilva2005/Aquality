<div align="center">
<a href="https://ibb.co/ZRgbgC7v"><img src="https://i.ibb.co/LDgsgfHB/Plus-AB.png" alt="Plus-AB" border="0"></a>
<br><br>


[![React](https://img.shields.io/badge/React-1E1E1E?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-1E1E1E?style=flat-square&logo=typescript&logoColor=3178C6)](https://www.typescriptlang.org/)
[![Java](https://img.shields.io/badge/Java-1E1E1E?style=flat-square&logo=openjdk&logoColor=ED8B00)](https://www.java.com/)
[![Python](https://img.shields.io/badge/Python-1E1E1E?style=flat-square&logo=python&logoColor=3776AB)](https://www.python.org/)
<br>
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-1E1E1E?style=flat-square&logo=spring-boot&logoColor=6DB33F)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-1E1E1E?style=flat-square&logo=mysql&logoColor=4479A1)](https://www.mysql.com/)
[![Git](https://img.shields.io/badge/Git-1E1E1E?style=flat-square&logo=git&logoColor=F05032)](https://git-scm.com/)
[![Docker](https://img.shields.io/badge/Docker-1E1E1E?style=flat-square&logo=docker&logoColor=2496ED)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/Node.js-1E1E1E?style=flat-square&logo=nodedotjs&logoColor=339933)](https://nodejs.org/)


---

### Sobre o Projeto

<br>

O **Aquality** é um software de monitoramento inteligente de hidratação corporal, desenvolvido especificamente para otimizar a performance e a segurança de atletas de alto rendimento. 

Nascido de uma cooperação tecnológica e científica entre a **Hospital São Camilo** e o **Instituto Mauá de Tecnologia (IMT)**, o sistema une a expertise da saúde com a excelência em engenharia e desenvolvimento de software.

</div>
<br>

### Como Funciona?
A plataforma centraliza dados fisiológicos e níveis de hidratação em tempo real, permitindo que comissões técnicas compostas por treinadores, médicos e nutricionistas atuem de forma integrada e estratégica sobre o desempenho dos atletas. Além disso, a solução conta com mecanismos de inteligência artificial, utilizando um agente treinado para gerar análises, insights e recomendações inteligentes com base em evidências, proporcionando tomadas de decisão mais rápidas, precisas e eficazes.

### Diferenciais Estratégicos
Mais do que um simples painel de visualização, o **Aquality** atua como uma ferramenta preditiva e estratégica que proporciona:
* **Recomendações Inteligentes com IA:** Ajustes personalizados de hidratação com base no perfil, desempenho e demanda física de cada atleta, utilizando inteligência artificial para gerar insights, alertas e sugestões em tempo real.
* **Prevenção de Fadiga e Monitoramento Integrado:** Com uma interface intuitiva e colaborativa, diferentes profissionais podem acompanhar e atuar diretamente no desempenho do mesmo atleta, centralizando informações importantes para tomadas de decisão mais eficientes, produtivas e estratégicas.
* **Redução de Riscos à Saúde:** Monitoramento inteligente e contínuo para auxiliar na prevenção de estresse térmico, desidratação e desequilíbrios eletrolíticos, promovendo mais segurança, desempenho e bem-estar aos atletas.

---

## Como Iniciar o Projeto 

Siga as instruções abaixo para configurar e executar os ambientes de Front-end e Back-end da aplicação WEB.
<br>
<br>


<h3>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" width="30" align="center"/>
  1. Pré-requisitos
</h3>



Antes de iniciar, é necessário ter o Docker instalado e configurado na sua máquina.

* Instale o Docker Desktop: https://www.docker.com/products/docker-desktop/
* Certifique-se de que o Docker esteja em execução antes de continuar.

---

<h3> 📥 2. Clonar o Repositório </h3>

Abra o terminal e execute:

```bash id="l9f0s1"
git clone https://github.com/gacsilva2005/Aquality.git
```

Depois, acesse a pasta do projeto:

```bash id="d4m8n2"
cd Aquality
```

---

<h3> ⚙️ 3. Executar a Aplicação com Docker </h3>

No terminal, execute o seguinte comando:

```bash id="v3k7p6"
docker compose up --build
```

Esse comando irá:

* Construir os containers do projeto
* Inicializar o Front-end
* Inicializar o Back-end
* Configurar os serviços automaticamente

---

<h3>  🌐 4. Acessar a Aplicação </h3>

Após a inicialização dos containers, o terminal exibirá o link local da aplicação.

Exemplo:

```bash id="r8c2x5"
http://localhost:5713
```

Abra o link no navegador para acessar o sistema.

A partir de agora, o Front-end Web e o Back-end da aplicação já estão rodando e prontos para acesso. Caso também deseje testar a nossa solução em smartphones, siga as instruções abaixo para inicializar o ambiente Mobile.

---

<br>

## Como Iniciar o Projeto Mobile

Siga as instruções abaixo para configurar e executar o ambiente Mobile da aplicação.
<br>
<br>

<h3>
  📱 1. Pré-requisitos
</h3>

Antes de iniciar, é necessário ter o Node.js instalado na sua máquina e o aplicativo Expo Go no seu celular (ou um emulador configurado).

* Instale o Node.js (LTS): https://nodejs.org/
* Instale o aplicativo **Expo Go** no seu smartphone (disponível na Google Play Store ou App Store).

---

<h3> 📥 2. Clonar o Repositório </h3>

Abra o terminal e execute:

```bash
git clone [https://github.com/gacsilva2005/Aquality.git](https://github.com/gacsilva2005/Aquality.git)
Depois, acesse a pasta do projeto:
```

```Bash
cd Aquality
Acesse a pasta do Front-End e instale todas as dependências necessárias do projeto:
```

```Bash
cd Front-End
npm install
No terminal, limpe o cache e inicialize o servidor do Expo executando o seguinte comando:
```

```Bash
npx expo start -c
Após a inicialização do Expo, um QR Code será exibido diretamente no seu terminal.
```

No celular: Abra o aplicativo Expo Go e escaneie o QR Code para abrir o app.

No emulador: Se preferir rodar no computador, certifique-se de que o emulador está aberto e pressione a (para Android) ou i (para iOS) no terminal.


<br> 

## Agora você já pode acompanhar nosso projeto e todas as atualizações, nos apoie e transforme a hidratação dos atletas para sempre junto conosco! 💧

<br>

---

<br>

Desenvolvido por **Equipe Aquality**  
© 2026 Instituto Mauá de Tecnologia — Todos os direitos reservados.
