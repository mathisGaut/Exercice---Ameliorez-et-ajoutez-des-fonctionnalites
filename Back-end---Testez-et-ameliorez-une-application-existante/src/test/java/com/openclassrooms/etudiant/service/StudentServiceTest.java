package com.openclassrooms.etudiant.service;

import com.openclassrooms.etudiant.entities.Student;
import com.openclassrooms.etudiant.repository.StudentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
public class StudentServiceTest {

    private static final Long ID = 1L;
    private static final String FIRST_NAME = "Jean";
    private static final String LAST_NAME = "Dupont";
    private static final String EMAIL = "jean@test.fr";
    private static final String PHONE = "0612345678";
    private static final String ADDRESS = "1 rue Test";
    private static final String CITY = "Paris";

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private StudentService studentService;

    @Test
    public void create_student_savesAndReturns() {
        // GIVEN
        Student student = new Student();
        student.setFirstName(FIRST_NAME);
        student.setLastName(LAST_NAME);
        student.setEmail(EMAIL);
        student.setPhone(PHONE);
        student.setAddress(ADDRESS);
        student.setCity(CITY);
        when(studentRepository.save(any(Student.class))).thenAnswer(inv -> {
            Student s = inv.getArgument(0);
            s.setId(ID);
            return s;
        });

        // WHEN
        Student result = studentService.create(student);

        // THEN
        assertThat(result.getId()).isEqualTo(ID);
        verify(studentRepository).save(student);
    }

    @Test
    public void findById_validId_returnsStudent() {
        // GIVEN
        Student student = new Student();
        student.setId(ID);
        student.setFirstName(FIRST_NAME);
        student.setLastName(LAST_NAME);
        student.setEmail(EMAIL);
        student.setPhone(PHONE);
        student.setAddress(ADDRESS);
        student.setCity(CITY);
        when(studentRepository.findById(ID)).thenReturn(Optional.of(student));

        // WHEN
        Student result = studentService.findById(ID);

        // THEN
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(ID);
        assertThat(result.getFirstName()).isEqualTo(FIRST_NAME);
        verify(studentRepository).findById(ID);
    }

    @Test
    public void update_validId_updatesAndReturns() {
        // GIVEN
        Student existing = new Student();
        existing.setId(ID);
        existing.setFirstName("Old");
        existing.setLastName("Name");
        existing.setEmail("old@test.fr");
        existing.setPhone(PHONE);
        existing.setAddress(ADDRESS);
        existing.setCity(CITY);

        Student updatedStudent = new Student();
        updatedStudent.setFirstName(FIRST_NAME);
        updatedStudent.setLastName(LAST_NAME);
        updatedStudent.setEmail(EMAIL);
        updatedStudent.setPhone(PHONE);
        updatedStudent.setAddress(ADDRESS);
        updatedStudent.setCity(CITY);

        when(studentRepository.findById(ID)).thenReturn(Optional.of(existing));
        when(studentRepository.save(any(Student.class))).thenAnswer(inv -> inv.getArgument(0));

        // WHEN
        Student result = studentService.update(ID, updatedStudent);

        // THEN
        assertThat(result.getFirstName()).isEqualTo(FIRST_NAME);
        assertThat(result.getLastName()).isEqualTo(LAST_NAME);
        assertThat(result.getEmail()).isEqualTo(EMAIL);
        verify(studentRepository).save(existing);
    }

    @Test
    public void delete_validId_deletesStudent() {
        // GIVEN
        Student student = new Student();
        student.setId(ID);
        student.setFirstName(FIRST_NAME);
        student.setLastName(LAST_NAME);
        student.setEmail(EMAIL);
        student.setPhone(PHONE);
        student.setAddress(ADDRESS);
        student.setCity(CITY);
        when(studentRepository.findById(ID)).thenReturn(Optional.of(student));
        doNothing().when(studentRepository).delete(any(Student.class));

        // WHEN
        studentService.delete(ID);

        // THEN
        verify(studentRepository).findById(ID);
        verify(studentRepository).delete(student);
    }
}
