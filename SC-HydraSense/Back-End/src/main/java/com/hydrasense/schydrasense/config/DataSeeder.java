package com.hydrasense.schydrasense.config;

import com.hydrasense.schydrasense.model.Atleta;
import com.hydrasense.schydrasense.model.Clube;
import com.hydrasense.schydrasense.model.Profissional;
import com.hydrasense.schydrasense.repository.AtletaRepository;
import com.hydrasense.schydrasense.repository.ClubeRepository;
import com.hydrasense.schydrasense.repository.ProfissionalRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ClubeRepository clubeRepository;
    private final AtletaRepository atletaRepository;
    private final ProfissionalRepository profissionalRepository;

    public DataSeeder(ClubeRepository clubeRepository, AtletaRepository atletaRepository, ProfissionalRepository profissionalRepository) {
        this.clubeRepository = clubeRepository;
        this.atletaRepository = atletaRepository;
        this.profissionalRepository = profissionalRepository;
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

        if (atletaRepository.findByEmail("dev").isEmpty()) {
            Clube clubeDev = clubeRepository.findAll().stream().findFirst().orElse(null);
            if (clubeDev == null) {
                clubeDev = new Clube("Juventus", "JUVE-2024");
                clubeDev = clubeRepository.save(clubeDev);
            }

            Atleta devAtleta = new Atleta();
            devAtleta.setNome("Desenvolvedor Dev");
            devAtleta.setEmail("dev");
            devAtleta.setSenha("dev");
            devAtleta.setDataNascimento(LocalDate.of(2000, 1, 1));
            devAtleta.setPesoAtual(75.0);
            devAtleta.setAltura(1.75f);
            devAtleta.setClube(clubeDev);
            devAtleta.setAtivado(true);
            devAtleta.setCodigoAcesso("123456");

            atletaRepository.save(devAtleta);
            System.out.println("DataSeeder: Usuário dev/dev criado com sucesso no banco de dados.");
        }

        if (profissionalRepository.findByEmail("devpro").isEmpty()) {
            Clube clubeDev = clubeRepository.findAll().stream().findFirst().orElse(null);
            if (clubeDev == null) {
                clubeDev = new Clube("Juventus", "JUVE-2024");
                clubeDev = clubeRepository.save(clubeDev);
            }

            Profissional devPro = new Profissional();
            devPro.setNome("Fisiologista DevPro");
            devPro.setEmail("devpro");
            devPro.setSenha("devpro");
            devPro.setRegistro("12345");
            devPro.setUf("SP");
            devPro.setEspecialidade("Fisiologia");
            devPro.setClube(clubeDev);
            devPro.setTelefone("11999999999");
            devPro.setPerfil("Profissional");
            devPro.setResumo("Fisiologista de testes de desenvolvimento.");

            profissionalRepository.save(devPro);
            System.out.println("DataSeeder: Usuário profissional devpro/devpro criado com sucesso no banco de dados.");
        }
    }
}
