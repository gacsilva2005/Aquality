package com.hydrasense.schydrasense.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class CodigoRecuperacaoSenha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String codigo;

    private LocalDateTime expiracao;

    private Boolean usado = false;

    // getters e setters
}