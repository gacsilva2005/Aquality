package com.hydrasense.schydrasense.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class MedicaoEletrolitos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer concentracaoSodio;
    private Boolean marcasSal;
    private Boolean ocorrenciaCaimbras;

    @OneToOne
    @JoinColumn(name = "sessao_id")
    private SessaoDeTreino sessaoDeTreino;
}