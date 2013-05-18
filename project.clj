(defproject enavi "0.1.0-SNAPSHOT"
  :description "Entity Navigator"
  :url "http://timothypratley.blogspot.com"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.5.1"]
                 [compojure "1.1.5"]
                 [hiccup "1.0.3"]]
  :plugins [[lein-cljsbuild "0.3.2"]
            [lein-ring "0.8.5"]]
  :cljsbuild {
    :builds [{
        :source-paths ["cljs"]
        :compiler {
          :output-to "resources/public/js/main.js"
          :optimizations :whitespace
          :pretty-print true}}]}
  :ring {:handler enavi.routes/app})
