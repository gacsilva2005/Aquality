package com.hydrasense.schydrasense.repository;

import com.hydrasense.schydrasense.model.Atleta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AtletaRepository extends JpaRepository<Atleta, Long> {
    Optional<Atleta> findByEmail(String email);
    List<Atleta> findByClubeId(Long clubeId);
}