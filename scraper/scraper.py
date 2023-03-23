# Importing all required modules for
# Selenium
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
# Sleeping and to get the current date and time
from time import sleep
from datetime import datetime
# Work with json files
import json
# Display a progressbar in the console
from tqdm import tqdm

# Function which returns the current time as a string
def time_now():
    return f'[{datetime.now().hour}:{datetime.now().minute}:{datetime.now().second}]'

# Function which writes a dictionary to a json file at a given path
def dict_to_json(dict_data, json_file_path):
    with open(json_file_path, 'w') as f:
        json.dump(dict_data, f, indent=4)
        f.close()

# Function which downloads, creates and returns the Selenium-Chrome browser 
def get_driver(show_browser, max_win=0):
    # Options which are required for a good Selenium experience
    options = webdriver.ChromeOptions()
    options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_argument('log-level=OFF')
    if max_win == 1: # If the browser window should be maximized or not
        options.add_argument('--start-maximized')
    if show_browser == 0: # If the browser window should be shown or not
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
    # The driver is being downloaded from the Internet and setup with the given options
    driver = webdriver.Chrome(ChromeDriverManager().install(), options=options)

    return driver

# The main function in which the data is being scraped
def scrape(filename, show_browser=1):

    # Needed variables
    scraped_data = []
    # Driver is being created with the get_driver() function
    driver = get_driver(show_browser)

    # The driver gets and loads up the coinmarketcap website
    driver.get("https://coinmarketcap.com/")

    for page in range(1, 11):
        sleep(2)

        # The driver scrolls down to the bottom of the page in four steps, to make sure all 100 crypto tokens fully load up
        for i in range(7):
            driver.execute_script(f"window.scrollTo(0, (document.body.scrollHeight/7)*{i+1});")
            sleep(1)

        # All the html table elements of the table that contains all 100 tokens are searched and stored in table_elems
        # The while True loop is there to make sure the website already has fully loaded up and prevent the scraping process from hanging up
        while True:
            try:
                table_elems = driver.find_elements(By.XPATH, "/html/body/div[1]/div/div[1]/div[2]/div/div[1]/div[4]/table/tbody/tr")
                break 
            except:
                continue

        # The script goes through all elements of the table and prints a progress bar in the console
        print(f"Scraping progress of page {page}: ")
        for i in tqdm(range(len(table_elems))):
            # Try except statement because a crypto token can be either loaded up or only partially displayed on coinmarketcap and in the second case only very basic data is available for these tokens
            try:
                # All the data is being scraped for each crypto token and saved into variables
                # Text data can be scraped just by calling .text on a web-element, the chart link and the icons-class can be scraped by calling .get_attribute(<attribute name>)
                # For each trend data the icon must be checked to determine wether the trend is upwards or downwards and if the trend is downwards, then a "-" is added in front
                name = table_elems[i].find_element(By.XPATH, "./td[3]/div/a/div/div/p").text
                name_short = table_elems[i].find_element(By.XPATH, "./td[3]/div/a/div/div/div/p").text
                token_logo_img = table_elems[i].find_element(By.XPATH, "./td[3]/div/a/div/img").get_attribute("src")
                price = table_elems[i].find_element(By.XPATH, "./td[4]/div/a/span").text
                last_hour = table_elems[i].find_element(By.XPATH, "./td[5]/span").text
                last_hour_upDown = table_elems[i].find_element(By.XPATH, "./td[5]/span/span").get_attribute("class")
                if last_hour_upDown == "icon-Caret-down": 
                    last_hour = "-" + last_hour
                last_day = table_elems[i].find_element(By.XPATH, "./td[6]/span").text
                last_day_upDown = table_elems[i].find_element(By.XPATH, "./td[6]/span/span").get_attribute("class")
                if last_day_upDown == "icon-Caret-down":
                    last_day = "-" + last_day
                last_week = table_elems[i].find_element(By.XPATH, "./td[7]/span").text
                last_week_upDown = table_elems[i].find_element(By.XPATH, "./td[7]/span/span").get_attribute("class")
                if last_week_upDown == "icon-Caret-down":
                    last_week = "-" + last_week
                market_cap = table_elems[i].find_element(By.XPATH, "./td[8]/p/span[2]").text
                volume_24h = table_elems[i].find_element(By.XPATH, "./td[9]/div/a/p").text
                circulating_supply = table_elems[i].find_element(By.XPATH, "./td[10]/div/div[1]/p").text
                chart_last_week_img = table_elems[i].find_element(By.XPATH, "./td[11]/a/img").get_attribute("src")
                
                # All the scraped data is saved as a dictionary inside of a dictionary with its full name as the according key
                scraped_data.append({
                    "name": name,
                    "time_scraped": f"{datetime.now().day}.{datetime.now().month}.{datetime.now().year} {time_now()}",
                    "name_short": name_short, 
                    "price": price, 
                    "ranked": (page-1)*100 + (i+1),
                    "token_logo_img": token_logo_img,
                    "last_hour": last_hour,
                    "last_day": last_day,
                    "last_week": last_week,
                    "market_cap": market_cap,
                    "volume_24h": volume_24h,
                    "circulating_supply": circulating_supply,
                    "chart_last_week_img": chart_last_week_img
                    })
            except:              
                # If the token is only loaded up partially, only three pieces of data can be scraped and they are saved into the dict as another dict as well
                scraped_data.append({"name": "not available", "ranked": (page-1)*100 + (i+1)})
                # A warning is given to the user that the specific token didn't fully load up
                print(time_now(), f"Warning for {name}")
            
        driver.get(f"https://coinmarketcap.com/?page={page+1}")
    

    # The scraped data is saved to a json file in the current directory
    print(scraped_data)
    dict_to_json(scraped_data, filename + ".json")

if __name__ == '__main__':
    scrape("data_first_page")