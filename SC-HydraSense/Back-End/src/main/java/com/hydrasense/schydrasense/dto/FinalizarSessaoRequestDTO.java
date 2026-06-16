package com.hydrasense.schydrasense.dto;

import lombok.Data;

@Data
public class FinalizarSessaoRequestDTO {

    private Float pesoPosTreino;
    private Integer hidratacaoMl;
    private Integer duracaoSegundos;
    private Integer volumeUrinario;
    private Integer corUrina;
    private Integer sede;
    private Double descontoKitGramas;
    private String sintomas;
}