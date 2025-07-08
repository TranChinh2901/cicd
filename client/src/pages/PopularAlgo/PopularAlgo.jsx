
import styles from './PopularAlgo.module.css';
import { BsSortDown } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import { PiGraphLight } from "react-icons/pi";
import { PiTreeEvergreenLight } from "react-icons/pi";
import { Link } from 'react-router-dom';
const PopularAlgo = () => {
   
  return (
    <div className={styles.containerPopularAlgo}>
      <div data-aos="fade-right">
          <h2>Popular Algorithm Categories</h2>
        <p>Here you can find a list of popular algorithms.</p>
      </div>
        <div className={styles.listPopular}>
            <div className={styles.popularItems} data-aos="fade-right">
                    <ul>
                        <li><BsSortDown className={styles.iconPopularAlgo}/></li>
                        <li className={styles.titlePopularAlgo}>Sorting Algorithms</li>
                        <li>Bubble Sort</li>
                        <li>Quick Sort</li>
                        <li>Merge Sort</li>
                        <li>Heap Sort</li>
                        <li>Insertion Sort</li>
                        <li>Selection Sort</li>
                        <li>Radix Sort</li>
                        <li>Shell Sort</li>
                        <li>
                            <button className={styles.buttonPopular} >
                                    <Link className={styles.linkPopular} to={'https://ducchinhpro123.github.io/dsa/'}>Learn more</Link>
                                 </button>
                        </li>
                    </ul>
            </div>
              <div className={styles.popularItems} data-aos="fade-right">
                    <ul>
                        <li ><IoIosSearch className={styles.iconPopularAlgo}/></li>
                        <li className={styles.titlePopularAlgo}>Searching Algorithms</li>
                        <li>Binary Search</li>
                        <li>Linear Search</li>
                        <li>Jump Search</li>
                        <li>Interpolation Search</li>
                        <li>Exponential Search</li>
                        <li>Fibonacci Search</li>
                        <li>Ternary Search</li>
                        <li>Shell Search</li>
                        <li>
                            <button className={styles.buttonPopular} >
                                    <Link className={styles.linkPopular} to={'https://ducchinhpro123.github.io/dsa/'}>Learn more</Link>
                                 </button>
                        </li>
                    </ul>
            </div>
              <div className={styles.popularItems} data-aos="fade-left">
                    <ul>
                        <li ><PiGraphLight className={styles.iconPopularAlgo}/></li>
                        <li className={styles.titlePopularAlgo}>Graph Algorithms</li>
                        <li>Dijkstra's Algorithm</li>
                        <li>Breadth First Search</li>
                        <li>Depth First Search</li>
                        <li>Bellman Ford</li>
                        <li>Floyd Warshall</li>
                        <li>Kruskal's Algorithm</li>
                        <li>Prim's Algorithm</li>
                        <li>A* Pathfinding</li>
                        <li>
                            <button className={styles.buttonPopular} >
                                    <Link className={styles.linkPopular} to={'https://ducchinhpro123.github.io/dsa/'}>Learn more</Link>
                                 </button>
                        </li>
                    </ul>
            </div>
              <div className={styles.popularItems} data-aos="fade-left">
                    <ul>
                        <li ><PiTreeEvergreenLight className={styles.iconPopularAlgo}/></li>
                        <li className={styles.titlePopularAlgo}>Data Structures</li>
                        <li>Binary Trees</li>
                        <li>Linked Lists</li>
                        <li>Hash Tables</li>
                        <li>Stacks & Queues</li>
                        <li>AVL Trees</li>
                        <li>Red-Black Trees</li>
                        <li>Heaps</li>
                        <li>Tries</li>
                        <li>
                            <button className={styles.buttonPopular} >
                                    <Link className={styles.linkPopular} to={'https://ducchinhpro123.github.io/dsa/'}>Learn more</Link>
                                 </button>
                        </li>
                    </ul>
            </div>
        </div>
    </div>
  )
}

export default PopularAlgo
