package com.openclassrooms.etudiant.controller;

import com.openclassrooms.etudiant.dto.StudentRequestDTO;
import com.openclassrooms.etudiant.dto.StudentResponseDTO;
import com.openclassrooms.etudiant.entities.Student;
import com.openclassrooms.etudiant.mapper.StudentMapper;
import com.openclassrooms.etudiant.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final StudentMapper studentMapper;

    // ➕ Ajouter un étudiant
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StudentResponseDTO create(@Valid @RequestBody StudentRequestDTO dto) {
        Student student = studentMapper.toEntity(dto);
        Student saved = studentService.create(student);
        return studentMapper.toResponseDto(saved);
    }

    // 📄 Liste des étudiants
    @GetMapping
    public List<StudentResponseDTO> findAll() {
        return studentService.findAll()
                .stream()
                .map(studentMapper::toResponseDto)
                .toList();
    }

    // 🔍 Détail d’un étudiant
    @GetMapping("/{id}")
    public StudentResponseDTO findById(@PathVariable Long id) {
        Student student = studentService.findById(id);
        return studentMapper.toResponseDto(student);
    }

    // ✏️ Modifier un étudiant
    @PutMapping("/{id}")
    public StudentResponseDTO update(@PathVariable Long id,
                                     @Valid @RequestBody StudentRequestDTO dto) {
        Student student = studentMapper.toEntity(dto);
        Student updated = studentService.update(id, student);
        return studentMapper.toResponseDto(updated);
    }

    // 🗑️ Supprimer un étudiant
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        studentService.delete(id);
    }
}
