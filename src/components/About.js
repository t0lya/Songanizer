import React, { Component } from 'react'
import { Button } from 'reactstrap'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

export default class About extends Component {
  render() {
    return (
        <div className='container'>
          <div className='row align-items-center justify-content-start'>
            <Button href='https://github.com/let00/Songanizer' target='_blank' rel="noopener noreferrer">
              <FontAwesomeIcon icon={faGithub}/>
            </Button> 
            <span className='col col-mx-0'>Source code</span>
          </div>
          <br/>
          <div className='row align-items-center justify-content-start'>
            <Button href='mailto:lenguyenthanh@gmail.com' target='_blank' rel="noopener noreferrer">
              <FontAwesomeIcon icon={faEnvelope}/>
            </Button> 
            <span className='col col-mx-0'>Contact us</span>
          </div>
          <hr className="my-4" color='white'/>
          <div className='row align-items-center justify-content-start'>
            <h1>Songanizer Privacy Policy</h1>
            <p><br/>This Privacy Policy describes how your personal information is collected, used, and shared when you visit songanizer.net (the &ldquo;Site&rdquo;).<br/><br/></p>
            <h4>PERSONAL INFORMATION WE COLLECT</h4>
            <p>When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site. We refer to this automatically-collected information as &ldquo;Device Information.&rdquo;</p>
            <p>We collect Device Information using the following technologies:</p>
            <p>&ldquo;Log files&rdquo; track actions occurring on the Site, and collect data including your IP address, browser type, Internet service provider, referring/exit pages, and date/time stamps.<br />- &ldquo;Web beacons,&rdquo; &ldquo;tags,&rdquo; and &ldquo;pixels&rdquo; are electronic files used to record information about how you browse the Site.<br/><br/></p>
            <h4>SHARING YOUR PERSONAL INFORMATION</h4>
            <p>We share your Personal Information with third parties to help us use your Personal Information, as described above.</p>
            <p>Finally, we may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.</p>
            <p>DO NOT TRACK<br />Please note that we do not alter our Site&rsquo;s data collection and use practices when we see a Do Not Track signal from your browser.</p>
            <p>DATA RETENTION<br />When you use the Site, we will maintain your information for our records unless and until you ask us to delete this information.</p>
            <p>CHANGES<br />We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons.</p>
            <p>CONTACT US<br />For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail using the link above.</p>
          </div>
        </div>
    )
  }
}