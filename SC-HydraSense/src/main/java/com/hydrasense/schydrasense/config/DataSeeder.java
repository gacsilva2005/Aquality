package com.hydrasense.schydrasense.config;

import com.hydrasense.schydrasense.model.Clube;
import com.hydrasense.schydrasense.repository.ClubeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ClubeRepository clubeRepository;

    public DataSeeder(ClubeRepository clubeRepository) {
        this.clubeRepository = clubeRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (clubeRepository.count() == 0) {
            List<Clube> clubesIniciais = Arrays.asList(
                    new Clube("Corinthians", "CORI-2024"),
                    new Clube("Palmeiras", "PALM-2024"),
                    new Clube("Santos", "SANT-2024"),
                    new Clube("São Paulo", "SAOP-2024"),
                    new Clube("América-SP", "AMER-2024"),
                    new Clube("Guarani", "GUAR-2024"),
                    new Clube("Ponte Preta", "PONT-2024"),
                    new Clube("Ituano", "ITUA-2024"),
                    new Clube("Juventus", "JUVE-2024"),
                    new Clube("Portuguesa", "PORT-2024")
            );

            clubeRepository.saveAll(clubesIniciais);
            System.out.println("DataSeeder: 10 Clubes inseridos com sucesso no banco de dados.");
        }
    }
}
