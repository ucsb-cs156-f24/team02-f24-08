package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.MenuItemReview;
import edu.ucsb.cs156.example.repositories.MenuItemReviewRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.time.LocalDateTime;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = MenuItemReviewController.class)
@Import(TestConfig.class)
public class MenuItemReviewControllerTests  extends ControllerTestCase {
    @MockBean
    MenuItemReviewRepository menuItemReviewRepository;

    @MockBean
    UserRepository userRepository;

    // Authorization tests for /api/ucsbdates/admin/all

    @Test
    public void logged_out_users_cannot_get_all() throws Exception {
            mockMvc.perform(get("/api/menuitemreview/all"))
                            .andExpect(status().is(403)); // logged out users can't get all
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_users_can_get_all() throws Exception {
            mockMvc.perform(get("/api/menuitemreview/all"))
                            .andExpect(status().is(200)); // logged
    }

    // // Tests with mocks for database actions

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

            // arrange
            LocalDateTime ldt = LocalDateTime.parse("2022-01-03T00:00:00");

            MenuItemReview menuItemReview = MenuItemReview.builder()
                                    .itemId(1L)
                                    .reviewerEmail("testemail@ucsb.edu")
                                    .dateReviewed(ldt)
                                    .stars(5)
                                    .comments("test")
                                    .build();

            when(menuItemReviewRepository.findById(eq(7L))).thenReturn(Optional.of(menuItemReview));

            // act
            MvcResult response = mockMvc.perform(get("/api/menuitemreview?id=7"))
                            .andExpect(status().isOk()).andReturn();

            // assert

            verify(menuItemReviewRepository, times(1)).findById(eq(7L));
            String expectedJson = mapper.writeValueAsString(menuItemReview);
            String responseString = response.getResponse().getContentAsString();
            assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

            // arrange

            when(menuItemReviewRepository.findById(eq(7L))).thenReturn(Optional.empty());

            // act
            MvcResult response = mockMvc.perform(get("/api/menuitemreview?id=7"))
                            .andExpect(status().isNotFound()).andReturn();

            // assert

            verify(menuItemReviewRepository, times(1)).findById(eq(7L));
            Map<String, Object> json = responseToJson(response);
            assertEquals("EntityNotFoundException", json.get("type"));
            assertEquals("MenuItemReview with id 7 not found", json.get("message"));
    }

    // Authorization tests for /api/ucsbdates/post
    // (Perhaps should also have these for put and delete)

    @Test
    public void logged_out_users_cannot_post() throws Exception {
            mockMvc.perform(post("/api/menuitemreview/post"))
                            .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_regular_users_cannot_post() throws Exception {
            mockMvc.perform(post("/api/menuitemreview/post"))
                            .andExpect(status().is(403)); // only admins can post
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void logged_in_admin_users_can_post() throws Exception {
            // arrange

            LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

            MenuItemReview menuItemReview = MenuItemReview.builder()
                                    .itemId(1L)
                                    .reviewerEmail("testemail@ucsb.edu")
                                    .dateReviewed(ldt1)
                                    .stars(5)
                                    .comments("test")
                                    .build();

            when(menuItemReviewRepository.save(eq(menuItemReview))).thenReturn(menuItemReview);

            // act
            MvcResult response = mockMvc.perform(post("/api/menuitemreview/post?itemId=1&reviewerEmail=testemail@ucsb.edu&dateReviewed=2022-01-03T00:00:00&stars=5&comments=test")
                    .with(csrf()))
                .andExpect(status().is(200)).andReturn(); // only admins can post

            // assert

            verify(menuItemReviewRepository, times(1)).save(menuItemReview);
            String expectedJson = mapper.writeValueAsString(menuItemReview);
            String responseString = response.getResponse().getContentAsString();
            assertEquals(expectedJson, responseString);

    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_user_can_get_all_menuitemreviews() throws Exception {

            // arrange
            LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
            MenuItemReview menuItemReview1 = MenuItemReview.builder()
                            .itemId(1L)
                            .reviewerEmail("testuser1@ucsb.edu")
                            .dateReviewed(ldt1)
                            .stars(5)
                            .comments("Great food!")
                            .build();

            LocalDateTime ldt2 = LocalDateTime.parse("2022-03-11T00:00:00");

            MenuItemReview menuItemReview2 = MenuItemReview.builder()
                            .itemId(1L)
                            .reviewerEmail("testuser2@ucsb.edu")
                            .dateReviewed(ldt2)
                            .stars(5)
                            .comments("Great food!")
                            .build();

            ArrayList<MenuItemReview> expectedReviews = new ArrayList<>();
            expectedReviews.addAll(Arrays.asList(menuItemReview1, menuItemReview2));

            when(menuItemReviewRepository.findAll()).thenReturn(expectedReviews);

            // act
            MvcResult response = mockMvc.perform(get("/api/menuitemreview/all"))
                            .andExpect(status().isOk()).andReturn();

            // assert

            verify(menuItemReviewRepository, times(1)).findAll();
            String expectedJson = mapper.writeValueAsString(expectedReviews);
            String responseString = response.getResponse().getContentAsString();
            assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_can_edit_an_existing_menuitemreview() throws Exception {
            // arrange

            LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
            LocalDateTime ldt2 = LocalDateTime.parse("2023-01-03T00:00:01");

            MenuItemReview menuItemReviewOrig = MenuItemReview.builder()
                            .itemId(1L)
                            .reviewerEmail("testuser@ucsb.edu")
                            .dateReviewed(ldt1)
                            .stars(4)
                            .comments("Good food!")
                            .build();

            MenuItemReview menuItemReviewEdited = MenuItemReview.builder()
                            .itemId(2L)
                            .reviewerEmail("testuser2@ucsb.edu")
                            .dateReviewed(ldt2)
                            .stars(5)
                            .comments("Great food!")
                            .build();

            String requestBody = mapper.writeValueAsString(menuItemReviewEdited);

            when(menuItemReviewRepository.findById(eq(67L))).thenReturn(Optional.of(menuItemReviewOrig));

            // act
            MvcResult response = mockMvc.perform(
                            put("/api/menuitemreview?id=67")
                                            .contentType(MediaType.APPLICATION_JSON)
                                            .characterEncoding("utf-8")
                                            .content(requestBody)
                                            .with(csrf()))
                            .andExpect(status().isOk()).andReturn();

            // assert
            verify(menuItemReviewRepository, times(1)).findById(67L);
            verify(menuItemReviewRepository, times(1)).save(menuItemReviewEdited); // should be saved with correct user
            String responseString = response.getResponse().getContentAsString();

            Map<String, Object> json = responseToJson(response);
            assertEquals(2, json.get("itemId"));
            assertEquals("testuser2@ucsb.edu", json.get("reviewerEmail"));
            assertEquals("2023-01-03T00:00:01", json.get("dateReviewed"));
            assertEquals(5, json.get("stars"));
            assertEquals("Great food!", json.get("comments"));
            

            assertEquals(requestBody, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_cannot_edit_menuitemreview_that_does_not_exist() throws Exception {
            // arrange

            LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

            MenuItemReview menuItemReviewEdited = MenuItemReview.builder()
                    .itemId(1L)
                    .reviewerEmail("testuser@ucsb.edu")
                    .dateReviewed(ldt1)
                    .stars(5)
                    .comments("Great food!")
                    .build();

            String requestBody = mapper.writeValueAsString(menuItemReviewEdited);

            when(menuItemReviewRepository.findById(eq(67L))).thenReturn(Optional.empty());

            // act
            MvcResult response = mockMvc.perform(
                            put("/api/menuitemreview?id=67")
                                            .contentType(MediaType.APPLICATION_JSON)
                                            .characterEncoding("utf-8")
                                            .content(requestBody)
                                            .with(csrf()))
                            .andExpect(status().isNotFound()).andReturn();

            // assert
            verify(menuItemReviewRepository, times(1)).findById(67L);
            Map<String, Object> json = responseToJson(response);
            assertEquals("MenuItemReview with id 67 not found", json.get("message"));

    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_can_delete_a_menuitemreview() throws Exception {
        // arrange

        LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

        MenuItemReview menuItemReview = MenuItemReview.builder()
                .itemId(1L)
                .reviewerEmail("testuser@ucsb.edu")
                .dateReviewed(ldt1)
                .stars(5)
                .comments("Great food!")
                .build();

        when(menuItemReviewRepository.findById(eq(15L))).thenReturn(Optional.of(menuItemReview));

        // act
        MvcResult response = mockMvc.perform(
                        delete("/api/menuitemreview?id=15")
                                        .with(csrf()))
                        .andExpect(status().isOk()).andReturn();

        // assert
        verify(menuItemReviewRepository, times(1)).findById(15L);
        verify(menuItemReviewRepository, times(1)).delete(any());

        Map<String, Object> json = responseToJson(response);
        assertEquals("MenuItemReview with id 15 deleted", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_tries_to_delete_non_existant_menuitemreview_and_gets_right_error_message()
                    throws Exception {
        // arrange

        when(menuItemReviewRepository.findById(eq(15L))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(
                        delete("/api/menuitemreview?id=15")
                                        .with(csrf()))
                        .andExpect(status().isNotFound()).andReturn();

        // assert
        verify(menuItemReviewRepository, times(1)).findById(15L);
        Map<String, Object> json = responseToJson(response);
        assertEquals("MenuItemReview with id 15 not found", json.get("message"));
    }
}
