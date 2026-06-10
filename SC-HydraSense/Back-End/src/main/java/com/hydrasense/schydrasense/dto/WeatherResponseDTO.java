package com.hydrasense.schydrasense.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WeatherResponseDTO {

    private double temperatura;
    private double umidade;
    private String descricao;
    private double aumentoSudoresePercent;
    private double aguaRecomendadaLitros;
}
