package com.hydrasense.schydrasense.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Entity
public class RegistroDeSintoma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Getters e Setters
    @Setter
    private String sintomas;

    @Setter
    private String dores;

    @Setter
    private LocalDateTime dataHora;

    // Relação 1:1 SessaoDeTreino
    @Setter
    @OneToOne
    @JoinColumn(name = "sessao_id")
    private SessaoDeTreino sessaoDeTreino;

    // Construtor padrão JPA
    public RegistroDeSintoma() {}

    // Método
    public void alterarSintomas(String sintomas, String dores) {
        this.sintomas = sintomas;
        this.dores = dores;
    }
}