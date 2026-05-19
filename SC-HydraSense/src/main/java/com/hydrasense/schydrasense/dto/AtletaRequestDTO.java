package com.hydrasense.schydrasense.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AtletaRequestDTO {

    private String nome;

    private String email;

    private String senha;

    private String codigoEquipe;

    private Float altura;

    private String modalidade;

    private LocalDate dataNascimento;

    private String modalidadePrincipal;

    private Double pesoAtual;
}