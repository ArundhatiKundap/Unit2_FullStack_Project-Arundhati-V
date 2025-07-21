import React, { useState, useEffect } from "react";
import {
    Paper,
    Typography,
    MobileStepper,
    useTheme,
} from "@mui/material";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import '../styles/home.css';
export default function Home() {
    const animationImg = [
        {
            label: "Steps to success",
            imgPath: "/assets/animator6.jpeg",
        },
        {
            label: "Planning",
            imgPath: "/assets/animatorimage2.jpeg",
        },
        {
            label: "Strategy",
            imgPath: "/assets/animatorImg1.jpeg",
        },
        {
            label: "Goals",
            imgPath: "/assets/animatorimg3.jpeg",
        },
        {
            label: "Vision",
            imgPath: "/assets/animatorimg5.jpeg",
        },
        
        {
            label: "Success",
            imgPath: "/assets/animatorimg6.jpeg",
        },
    ];

   
        const theme = useTheme();
        const [activeStep, setActiveStep] = useState(0);
        const maxSteps = animationImg.length;

        useEffect(() => {
            const interval = setInterval(() => {
                setActiveStep((prevStep) => (prevStep + 1) % maxSteps);
            }, 2000); // 3 seconds

            return () => clearInterval(interval); // Cleanup on unmount
        }, [maxSteps]);


    return (  
        <>
            <div className="animation-container">
                <div className="animator-class">
                    <h1>STOCK TRADING JOURNAL</h1>
                    <h2>key to success</h2>

                    <Paper
                        square
                        elevation={0}
                        sx={{
                            height: 50,
                            display: "flex",
                            alignItems: "center",
                            pl: 2,
                            bgcolor: "background.default",
                        }}
                    >
                        <Typography>{animationImg[activeStep].label}</Typography>
                    </Paper>

                    <img
                        src={animationImg[activeStep].imgPath}
                        alt={animationImg[activeStep].label}
                        style={{
                            height: 255,
                            width: "100%",
                            maxWidth: 400,
                            display: "block",
                            overflow: "hidden",
                        }}
                    />

                    <MobileStepper
                        steps={maxSteps}
                        position="static"
                        activeStep={activeStep}
                        nextButton={null}
                        backButton={null}
                    />
                </div>
            </div>
        </>
          
      );
}