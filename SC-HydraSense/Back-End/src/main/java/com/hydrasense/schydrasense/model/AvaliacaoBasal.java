package com.hydrasense.schydrasense.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class AvaliacaoBasal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String corUrina;
    private Boolean sensacaoSede;

    private Integer urina;
    private Integer sede;

    @ManyToOne
    @JoinColumn(name = "sessao_id")
    private SessaoDeTreino sessaoDeTreino;
}