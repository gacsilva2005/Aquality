package com.hydrasense.schydrasense.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class CondicaoAmbiental {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Float temperatura;
    private Float umidade;
    private Float sensacaoTermica;

    // Relação 1:1 com a Sessão
    @OneToOne
    @JoinColumn(name = "sessao_id")
    private SessaoDeTreino sessaoDeTreino;
}