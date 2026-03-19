[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-blue.svg)](https://creativecommons.org/licenses/by/4.0/)

# Sistema Adaptativo Baseado em Dimensões de Aprendizagem para o Ensino de Fundamentos de IA Generativa em Ambiente On-line

---

## Descrição Geral do Artigo

Este repositório reúne os **artefatos analíticos e computacionais** associados ao estudo **“Sistema Adaptativo Baseado em Dimensões de Aprendizagem para o Ensino de Fundamentos de IA Generativa em Ambiente On-line”**.

O trabalho apresenta o **desenho, implementação e avaliação** de um sistema educacional adaptativo que utiliza **lógica fuzzy** para personalizar trilhas de aprendizagem, aliado a técnicas de **mineração de dados e análise estatística** para investigar os efeitos da adaptação no processo de aprendizagem.

---

## Objetivo da Análise

A análise de dados tem como objetivo:

* Investigar o impacto do sistema adaptativo no desempenho dos estudantes
* Comparar grupos (controle vs. experimental)
* Avaliar dimensões **cognitiva, metacognitiva e afetiva**
* Fornecer evidências quantitativas para validação do modelo adaptativo

---

## Fundamentos Teóricos

A análise está fundamentada em:

* Learning Analytics
* Mineração de Dados Educacionais (Educational Data Mining)
* Estatística aplicada à educação
* Sistemas Adaptativos baseados em lógica fuzzy
* Dimensões da aprendizagem (cognitiva, metacognitiva e afetiva)

Esses fundamentos sustentam a interpretação dos resultados obtidos.

---

## Base de Dados

O dataset utilizado contém informações coletadas ao longo do experimento, incluindo:

* Identificação anonimizada dos participantes
* Grupo experimental ou controle
* Resultados do pré-teste e pós-teste
* Desempenho nos tópicos (T01–T04)
* Indicadores de dificuldade percebida e autoconfiança
* Scores fuzzy e trilhas adaptativas
* Métricas de experiência do usuário (UX)

Os dados foram tratados garantindo anonimização e integridade.

---

## Técnicas de Análise

A análise de dados envolveu:

### 🔹 Análise Exploratória de Dados (EDA)

* Estatísticas descritivas
* Distribuição dos dados
* Identificação de padrões iniciais

---

### 🔹 Testes Estatísticos

Foram aplicados testes para validação dos resultados:

* Teste de normalidade: **Shapiro-Wilk**
* Homogeneidade de variância: **Levene**
* Comparação entre grupos: **Mann-Whitney** (não paramétrico)

---

### 🔹 Tamanho de Efeito

* Para quantificar o impacto: **Cohen’s d**

---

## Arquitetura Analítica

O pipeline de análise segue as etapas:

1. Coleta dos dados do sistema adaptativo
2. Pré-processamento e limpeza dos dados
3. Normalização e preparação das variáveis
4. Execução dos testes estatísticos
5. Interpretação dos resultados

---

## Conteúdo do Repositório

Este repositório contém:

* Dataset do experimento (`curso_ia_generativa.xlsx`)
* Scripts de análise (Python / Google Colab)
* Código completo do curso adaptativo (HTML, JavaScript e Google Apps Script)
* README técnico para reprodutibilidade

---

## Metodologia Experimental

A avaliação foi conduzida considerando:

* Aplicação de pré-teste e pós-teste
* Execução do curso com grupo controle e experimental
* Coleta contínua de dados ao longo dos tópicos
* Análise comparativa entre abordagens adaptativa e não adaptativa

---

## Reprodutibilidade Científica

Em alinhamento com princípios de **Ciência Aberta**, este repositório permite:

* Reproduzir as análises realizadas
* Validar os resultados apresentados
* Reutilizar os dados em novos estudos
* Estender o modelo para outros contextos educacionais

---

## Uso de Inteligência Artificial

O estudo emprega:

* **Lógica fuzzy** para adaptação da aprendizagem
* Técnicas de **mineração de dados** para análise dos resultados

Ferramentas de IA generativa podem ter sido utilizadas como apoio à organização e interpretação dos resultados, sem interferir na condução científica do estudo.

---

## Aspectos Éticos

O estudo respeita:

* Consentimento dos participantes
* Anonimização dos dados
* Uso exclusivo para fins acadêmicos e científicos

---

## Licença

Os artefatos deste repositório estão licenciados sob **Creative Commons CC BY 4.0**, permitindo uso, adaptação e redistribuição, desde que citada a autoria.

---

## Observação Importante

Este repositório **não substitui o artigo científico**, mas atua como suporte para:

* Transparência metodológica
* Reprodutibilidade
* Compartilhamento dos dados e análises

Informações adicionais poderão ser incluídas após a publicação do artigo.

---

## ⚙️ Reprodutibilidade Técnica da Análise

Esta seção descreve como reproduzir as análises realizadas no estudo utilizando **Python e Google Colab**.

---

### 🔧 Ambiente de Execução

A análise foi desenvolvida utilizando:

* Python 3.x  
* Google Colab  
* Bibliotecas principais:
  * pandas  
  * numpy  
  * scikit-learn  
  * scipy  
  * matplotlib  

---

### 📘 Notebook de Análise

A reprodução dos resultados deve ser realizada por meio do notebook:

```
curso_ia_generativa.ipynb
```

Este notebook contém:

* Pré-processamento dos dados  
* Análise exploratória (EDA)  
* Testes estatísticos  
* Cálculo de métricas e visualizações  

---

### 📂 Preparação dos Dados

1. Faça o download do dataset:

```
curso_ia_generativa.xlsx
```

### ▶️ Execução

1. Abra o notebook `curso_ia_generativa.ipynb` no Colab
3. Faça o upload do `curso_ia_generativa.xlsx`  
4. Execute as células na ordem apresentada  
5. Certifique-se de que o dataset está no mesmo ambiente do notebook  

---

### ✅ Reprodutibilidade

Para garantir a reprodutibilidade dos resultados:

* Utilize o dataset original disponibilizado  
* Não altere os parâmetros dos modelos  
* Execute o notebook integralmente  

---

### 💡 Observação

O notebook foi estruturado para execução direta no Google Colab, não sendo necessária instalação local de dependências.

---




