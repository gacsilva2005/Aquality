package com.hydrasense.schydrasense.dto;

import lombok.Data;

@Data
public class PesagemPreTreinoDTO {

    private Float pesoPreTreino;
    private Integer corUrina;
    private Integer sede;

    private Double descontoKitGramas;
    private String sintomas;
    private ChecklistDTO checklist;

    @Data
    public static class ChecklistDTO {
        private Boolean bexiga;
        private Boolean balancaCorreta;
        private Boolean superficiePlana;
        private Boolean vestimentaCorreta;
        private Boolean semCalcados;
        private Boolean semAcessorios;
    }
}