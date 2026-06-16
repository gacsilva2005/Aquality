package com.hydrasense.schydrasense.repository;

import com.hydrasense.schydrasense.model.Profissional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfissionalRepository extends JpaRepository<Profissional, Long> {
    Optional<Profissional> findByEmail(String email);

    Optional<Profissional> findByEmailAndSenha(String email, String senha);
}