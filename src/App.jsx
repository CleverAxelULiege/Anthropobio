import { useState, useEffect } from "react";
import Home from "./home/Home";
import Learning from "./learning/Learning";
import './types.js'
import Nav from "./components/nav/Nav.jsx";
import Observation from "./observation/Observation.jsx";
import Title from "./components/title/Title.jsx";

/** @type {Primate[]} */
export const PRIMATES = data.primates;

/** @type {Primate[]} */
export const PRIMATES_LIGHT = PRIMATES.filter((primate) => primate.isExpert === false);

/**@type {Video[]} */
export const BASE_VIDEOS = data.base_videos;

/**@type {Video[]} */
export const CRITERION_VIDEOS = data.criterion_videos;

export const VIDEOS = [...BASE_VIDEOS, ...CRITERION_VIDEOS];

/** @type {CriterionWithAnswers[]} */
export const CRITERIA_WITH_ANSWERS = data.criteria_with_answers;

export const TABS = {
  home: "home",
  learning: "learning",
  observation: "observation"
};

function App() {
  function getTabFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    return Object.values(TABS).includes(tabParam) ? tabParam : TABS.home;
  }

  const [tab, setTab] = useState(getTabFromUrl);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.pushState({}, "", url);
  }, [tab]);

  useEffect(() => {
    const handlePopState = () => {
      setTab(getTabFromUrl());
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <main>
      {tab === TABS.home && <Home setTabs={setTab} />}

      {
        [TABS.learning, TABS.observation].includes(tab) &&
        <>
          <Nav setTab={setTab}></Nav>
          <div className="center">
            <Title>Identification de crânes de singes <br></br> et d'hommes fossiles</Title>
          </div>
        </>
      }

      {tab === TABS.learning && <Learning></Learning>}
      {tab === TABS.observation && <Observation></Observation>}
    </main>
  );
}

export default App;
