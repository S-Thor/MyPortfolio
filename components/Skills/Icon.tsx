import { useContext, useState, useEffect, useRef } from "react";
import { useSpring, animated as a } from "react-spring";

import { Box, Typography } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { DarkModeContext } from "context/themeContext";

function Icon({
  title,
  logo,
  invert,
  spin,
}: {
  title: string;
  logo: any;
  invert?: boolean;
  spin?: boolean;
}) {
  const logoRef = useRef<HTMLImageElement | null>(null);
  const [props, set] = useSpring<{ xys: number[] }>(() => ({
    xys: [0, 0, 1],
    config: { mass: 1, tension: 500, friction: 15 },
  }));
  const [invertState, setInvertState] = useState(false);
  const useStyles = makeStyles((_theme: Theme) =>
    createStyles({
      root: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
      logo: {
        width: "100%",
        flexGrow: 1,
        filter: `invert(${invertState ? "100%" : "0%"})`,
        animation: `${spin ? "$App-logo-spin infinite 20s linear" : ""}`,
      },
      logoContainer: {
        width: "60%",
        flexGrow: 1,
      },
      "@keyframes App-logo-spin": {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(360deg)" },
      },
    })
  );

  const classes = useStyles();
  const darkMode = useContext(DarkModeContext);

  // const calc = (x: number, y: number) => [
  //   -(y - window.innerHeight / 2) / 20,
  //   (x - window.innerWidth / 2) / 20,
  //   1.1,
  // ];
  const calc = (x: number, y: number) => [
    -(
      y -
      (logoRef.current?.getBoundingClientRect().top! +
        logoRef.current?.getBoundingClientRect().bottom!) /
        2
    ) / 20,
    (x -
      (logoRef.current?.getBoundingClientRect().left! +
        logoRef.current?.getBoundingClientRect().right!) /
        2) /
      20,
    1.2,
  ];
  const trans: any = (x: number, y: number, s: number) =>
    `perspective(25px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

  useEffect(() => {
    if (darkMode !== undefined) {
      if (darkMode && invert) {
        return setInvertState(true);
      }
      setInvertState(false);
    }
  }, [darkMode]);

  return (
    <Box className={classes.root}>
      <Typography align="center" variant="caption" gutterBottom>
        {title}
      </Typography>
      <a.div
        onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
        onMouseLeave={() => set({ xys: [0, 0, 1] })}
        style={{ transform: props.xys.interpolate(trans) }}
        className={classes.logoContainer}
      >
        <img ref={logoRef} className={classes.logo} src={logo} />
      </a.div>
    </Box>
  );
}

export default Icon;