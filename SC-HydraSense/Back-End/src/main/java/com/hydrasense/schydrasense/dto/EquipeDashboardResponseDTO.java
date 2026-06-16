package com.hydrasense.schydrasense.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class EquipeDashboardResponseDTO {
    private Long id;
    private String nome;
    private Double hidratacaoTotalHoje;
    private Double hidratacaoVariacaoOntem;
    private Double taxaMediaSudorese;
    private Integer statusCriticoCount;
    private StatusDistDTO statusDist;
    private List<GraficoPontoDTO> graficoBalanco;
    private List<AtletaDashboardDTO> atletas;

    @Getter
    @Setter
    public static class StatusDistDTO {
        private Integer otimo;
        private Integer atencao;
        private Integer critico;

        public StatusDistDTO() {
            this.otimo = 0;
            this.atencao = 0;
            this.critico = 0;
        }
    }

    @Getter
    @Setter
    public static class GraficoPontoDTO {
        private String dia;
        private Double balanco;

        public GraficoPontoDTO(String dia, Double balanco) {
            this.dia = dia;
            this.balanco = balanco;
        }
    }

    @Getter
    @Setter
    public static class AtletaDashboardDTO {
        private Long id;
        private String nome;
        private String role;
        private String status;
        private String statusColor;
        private Double vol;
        private String maxVol;
        private Double progress;
        private String avatar;
    }
}
