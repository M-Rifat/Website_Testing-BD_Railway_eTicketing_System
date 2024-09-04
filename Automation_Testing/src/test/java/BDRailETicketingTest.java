import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.edge.EdgeDriver;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Parameters;
import org.testng.annotations.Test;

import java.time.Duration;
import java.util.List;

public class BDRailETicketingTest {

    WebDriver driver;

    @BeforeTest
    @Parameters({"browser"})
    public void openBrowser(String browser){
        if(browser.equalsIgnoreCase("chrome")){
            driver = new ChromeDriver();
        }
        else {
            driver = new EdgeDriver();
        }
        driver.manage().window().maximize();
    }

    @AfterTest
    public void closeBrowser() throws InterruptedException {
        Thread.sleep(9000);
        driver.quit();
    }

    @Test(priority = 1)
    public void openWebsite() throws InterruptedException {
        driver.get("https://eticket.railway.gov.bd/");
        //Agree
        Thread.sleep(2000);
        driver.findElement(By.className("agree-btn")).click();
        String title= driver.getTitle();
        Assert.assertEquals(title,"Home | Bangladesh Railway E-ticketing Service","Failed");
    }


    @Test(priority = 2)
    public  void searchTrain() {
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));

        driver.findElement(By.xpath("//input[@id='dest_from']")).click();
        driver.findElement(By.xpath("//input[@id='dest_from']")).sendKeys("Dhaka");  //relative xpath-  //tagname[@attribute='value']
        driver.findElement(By.id("dest_to")).click();
        driver.findElement(By.id("dest_to")).sendKeys("Rangpur");
        driver.findElement(By.xpath("//*[@id=\"doj\"]")).click();
        driver.findElement(By.xpath("//a[normalize-space()='8']")).click();
        driver.findElement(By.cssSelector("#choose_class")).click(); //css selector-  tag#id  tag.class
        driver.findElement(By.xpath("//*[@id=\"choose_class\"]/option[8]")).click();
        driver.findElement(By.cssSelector("button[type='submit']")).click();

    }

    @Test(priority = 3)
    public void trainDetails() throws InterruptedException {
        Thread.sleep(2000);
        driver.findElement(By.xpath("//body/app-root/app-search-result[@class='ng-star-inserted']/div[@id='main_wrapper']/div[@id='search_list_sec']/div[@class='container']/div[@class='row']" +
                "/div[@class='col-lg-9 col-md-8 col-sm-12 col-xs-12 px-xs-1']/app-single-trip[1]/div[1]/div[2]/div[1]/button[1]")).click();
        Thread.sleep(2000);
        driver.findElement(By.xpath("//*[name()='path' and contains(@class,'ng-tns-c58')]")).click();
    }

    @Test(priority = 4)
    public void trainInfo(){
        driver.findElement(By.xpath("//a[normalize-space()='Train Information']")).click();
        WebElement emptyInfo=driver.findElement(By.xpath("//img[@alt='train information illustration']"));
        if(emptyInfo.isDisplayed()){
            System.out.println("Ok");
        }
    }

    @Test(priority = 5)
    public void test(){
        //check total link
        List<WebElement> listLink =driver.findElements(By.tagName("input"));
        System.out.println("Total link: "+listLink.size());
    }
}
