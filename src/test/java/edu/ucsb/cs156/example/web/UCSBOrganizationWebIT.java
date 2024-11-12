package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)

public class UCSBOrganizationWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_restaurant() throws Exception {
        setupUser(true);

        page.getByText("UCSBOrganization").click();

        page.getByText("Create UCSB Organization").click();
        assertThat(page.getByText("Create New UCSB Organization")).isVisible();
        page.getByTestId("UCSBOrganizationForm-orgCode").fill("DSC");
        page.getByTestId("UCSBOrganizationForm-orgTranslationShort").fill("Data Science Club");
        page.getByTestId("UCSBOrganizationForm-orgTranslation").fill("UCSB Data Science Club");
        page.getByTestId("UCSBOrganizationForm-inactive").selectOption("false");
        page.getByTestId("UCSBOrganizationForm-submit").click();

        assertThat(page.getByTestId("OrganizationTable-cell-row-0-col-orgCode"))
                .hasText("DSC");

        
    }

    @Test
    public void regular_user_cannot_create_organization() throws Exception {
        setupUser(false);

        page.getByText("UCSBOrganization").click();

        assertThat(page.getByText("Create UCSB Organization")).not().isVisible();
        assertThat(page.getByTestId("OrganizationTable-cell-row-0-col-orgCode")).not().isVisible();
    }
    
}
