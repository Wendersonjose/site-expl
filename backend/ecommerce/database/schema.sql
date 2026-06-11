-- ====================================================================
-- Explosion E-commerce — schema mínimo (MySQL)
-- ====================================================================
-- Subconjunto do modelo completo (../../database/Explo_DB.sql) contendo
-- apenas as tabelas usadas pelo backend atual: categorias, usuarios e
-- produtos. O banco de produção (Railway) já possui o modelo completo.
-- ====================================================================

CREATE TABLE IF NOT EXISTS categorias (
  id_categoria   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome_categoria VARCHAR(255) NOT NULL,
  PRIMARY KEY (id_categoria)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome         VARCHAR(45)  NOT NULL,
  email        VARCHAR(255) NOT NULL,
  senha        VARCHAR(255) NOT NULL,
  perfil       ENUM('cliente', 'admin') NOT NULL DEFAULT 'cliente',
  data_criacao TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_usuario),
  UNIQUE INDEX email_UNIQUE (email ASC)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS produtos (
  id_produto     INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  id_categoria   INT UNSIGNED  NOT NULL,
  nome           VARCHAR(45)   NOT NULL,
  descricao      TEXT          NULL,
  preco_venda    DECIMAL(10,2) NOT NULL,
  custo_unitario DECIMAL(10,2) NOT NULL,
  estoque_atual  INT UNSIGNED  NOT NULL DEFAULT 0,
  ativo          TINYINT(1)    NOT NULL DEFAULT 1,
  PRIMARY KEY (id_produto),
  INDEX id_categoria_idx (id_categoria ASC),
  CONSTRAINT fk_produtos_categoria
    FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS imagens_produto (
  id_imagem  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_produto INT UNSIGNED NOT NULL,
  url        VARCHAR(500) NOT NULL,
  principal  TINYINT(1)   NOT NULL DEFAULT 0,
  PRIMARY KEY (id_imagem),
  INDEX id_produto_idx (id_produto ASC),
  CONSTRAINT fk_imagens_produto
    FOREIGN KEY (id_produto) REFERENCES produtos (id_produto)
) ENGINE = InnoDB;
