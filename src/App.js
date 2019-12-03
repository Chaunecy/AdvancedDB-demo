import React from 'react';
import {
    Button,
    Checkbox,
    Dropdown,
    Grid,
    GridColumn, Pagination,
    Segment, Tab,
    Table,
    TableBody,
    TableCell, TableHeader, TableHeaderCell,
    TableRow, TabPane
} from "semantic-ui-react";

class MultiChoice extends React.Component {
    render() {
        const options = [];
        const option_set = new Set(this.props.options);
        for (const option of option_set) {
            options.push({
                key: option,
                text: option,
                value: option,
            })
        }
        const isMultiple = (this.props.multiple === undefined || this.props.multiple === true);
        return (
            <TableRow>
                <TableCell width={3}>
                    {this.props.placeholder}
                </TableCell>
                <TableCell>
                    <Dropdown
                        placeholder={this.props.placeholder}
                        fluid
                        multiple={isMultiple}
                        search
                        selection
                        options={options}
                        value={this.props.value}
                        onChange={this.props.onChange}
                    />

                </TableCell>
            </TableRow>
        )
    }
}

class SortConfigure extends React.Component {
    render() {
        const sort_list = this.props.sort_list;
        const checkbox_list = [];
        for (let i = 0, len = sort_list.length; i < len; i++) {
            const sort = sort_list[i];
            checkbox_list.push(
                <GridColumn key={"sort" + i}>
                    <Checkbox
                        radio
                        label={sort}
                        value={sort}
                        checked={this.props.sort_policy === sort}
                        onChange={this.props.handleSortChange}
                    />
                </GridColumn>
            )
        }
        return (
            <Segment>
                <Grid columns={"equal"}>
                    {checkbox_list}
                    <GridColumn width={2}>
                        <Checkbox
                            toggle label={"升序"}
                        />
                    </GridColumn>
                    <GridColumn width={2}>
                        <Button size={"mini"} primary
                                onClick={this.props.handleQueryClick}
                        >Query</Button>
                    </GridColumn>

                </Grid>
            </Segment>
        );
    }
}

class ShowLaptops extends React.Component {
    render() {
        const laptop_list = this.props.laptop_list;
        const page_number = this.props.page_number;
        const item_per_page = this.props.item_per_page;

        const laptops = [];
        if (laptop_list.length < 1 || item_per_page === 0) {
            return <div/>
        }
        const total_page = Math.ceil(laptop_list.length / item_per_page);

        const laptop = laptop_list[0];
        let header = [];
        for (let key of Object.getOwnPropertyNames(laptop)) {
            header.push(
                <TableHeaderCell key={"header" + key}>
                    {key.replace("_", " ")}
                </TableHeaderCell>
            )
        }
        for (let i = Math.max(item_per_page * (page_number - 1), 0),
                 len = Math.min(page_number * item_per_page, laptop_list.length); i < len; i++) {
            const cells = [];
            for (let key of Object.getOwnPropertyNames(laptop_list[i])) {
                cells.push(
                    <TableCell key={`body-${i}-${key}`}>
                        {laptop_list[i][key]}
                    </TableCell>
                )
            }
            laptops.push(
                <TableRow key={"laptop" + i}>
                    {cells}
                </TableRow>
            );
        }
        return (
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {header}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {laptops}
                    </TableBody>
                </Table>
                <Segment basic textAlign={"center"}>
                    <Pagination
                        activePage={page_number}
                        totalPages={total_page}
                        onPageChange={this.props.handlePageChange}
                    />
                </Segment>

            </div>
        );

    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.__props_link = "http://localhost:8000/users/props";
        this.__laptops_link = "http://localhost:8000/users/laptops";
        this.__recommendation = "http://localhost:8000/users/recommendation";

        this.state = {
            // received data
            cpu_list: ["AMD", "Intel i3", "Intel i9"],
            memory_list: ["8G"],
            ssd_list: ["256G", "1T", "0G"],
            hdd_list: ["1T", "512G", "0G"],
            price_interval_list: ["1000-2000"],
            brand_list: ["APPLE"],
            video_card_list: ["Titan V"],
            video_memory_list: ["8G", "sharing"],
            screen_resolution_list: ["1080x760", "1920x1080"],
            screen_size_list: ["14.0", "15.6"],
            sort_list: ["best"],
            reverse_list: [false, true],
            scenario_list: ["学生"],
            // sent data
            cpu: [],
            memory: [],
            ssd: [],
            hdd: [],
            price_interval: [],
            brand: [],
            video_card: [],
            video_memory: [],
            screen_resolution: [],
            screen_size: [],
            sort_policy: "best",
            scenario: "",
            reverse: false,
            // received data
            laptop_list: [{
                "product": "APPLE Pro Air Max Plus R MS",
                "brand": "APPLE",
                "cpu": "AMD",
                "ssd": "128G",
                "price": "2199",
                "video_card": "Titan V",
                "memory": "16G",
                "video_memory": "sharing",
                "hdd": "0G",
                "screen_size": "14.0",
                "screen_resolution": "2880x1980",
                "sales": "116"
            }],
            page_number: 1,
            item_per_page: 8,
            activeIndex: 0,
        };
        this.fetch_props();
    }

    render() {
        return (
            <div style={{"margin": "0 10%"}}>
                <Tab
                    activeIndex={this.state.activeIndex}
                    onTabChange={(e, {activeIndex}) => {
                        this.setState({activeIndex: activeIndex});
                    }}
                    menu={{pointing: true, secondary: true, fluid: true}}
                    panes={[
                        {
                            menuItem: {key: "Laptops", content: "Laptops", color: "teal"},
                            render:
                                () =>
                                    <TabPane>
                                        <Grid columns={"equal"}>
                                            <GridColumn>
                                                <Table definition celled structured>
                                                    <TableBody>
                                                        <MultiChoice
                                                            placeholder={"Brand"}
                                                            options={this.state.brand_list}
                                                            value={this.state.brand}
                                                            onChange={this.handleBrandChange.bind(this)}
                                                        />
                                                        <MultiChoice
                                                            placeholder={"Cpu"}
                                                            options={this.state.cpu_list}
                                                            value={this.state.cpu}
                                                            onChange={this.handleCpuChange.bind(this)}
                                                        />
                                                        <MultiChoice
                                                            placeholder={"Memory"}
                                                            options={this.state.memory_list}
                                                            value={this.state.memory}
                                                            onChange={this.handleMemoryChange.bind(this)}
                                                        />
                                                        <MultiChoice
                                                            placeholder={"Video Card"}
                                                            options={this.state.video_card_list}
                                                            value={this.state.video_card}
                                                            onChange={this.handleVideoCardChange.bind(this)}
                                                        />
                                                        <MultiChoice
                                                            placeholder={"Video Memory"}
                                                            options={this.state.video_memory_list}
                                                            value={this.state.video_memory}
                                                            onChange={this.handleVideoMemoryChange.bind(this)}
                                                        />
                                                    </TableBody>
                                                </Table>
                                            </GridColumn>
                                            <GridColumn>
                                                <Table definition celled structured>
                                                    <TableBody>
                                                        <MultiChoice
                                                            placeholder={"Screen Resolution"}
                                                            options={this.state.screen_resolution_list}
                                                            value={this.state.screen_resolution}
                                                            onChange={this.handleScreenResolutionChange.bind(this)}
                                                        />
                                                        <MultiChoice
                                                            placeholder={"Screen Size"}
                                                            options={this.state.screen_size_list}
                                                            value={this.state.screen_size}
                                                            onChange={this.handleScreenSizeChange.bind(this)}
                                                        />
                                                        <MultiChoice
                                                            placeholder={"SSD"}
                                                            options={this.state.ssd_list}
                                                            value={this.state.ssd}
                                                            onChange={this.handleSsdChange.bind(this)}
                                                        />
                                                        <MultiChoice
                                                            placeholder={"HDD"}
                                                            options={this.state.hdd_list}
                                                            value={this.state.hdd}
                                                            onChange={this.handleHddChange.bind(this)}
                                                        />
                                                        <MultiChoice
                                                            placeholder={"Price Interval"}
                                                            options={this.state.price_interval_list}
                                                            value={this.state.price_interval}
                                                            onChange={this.handlePriceIntervalChange.bind(this)}
                                                        />
                                                    </TableBody>
                                                </Table>
                                            </GridColumn>
                                        </Grid>

                                    </TabPane>

                        }, {
                            menuItem: {key: "Recommendation", content: "Recommendation", color: "teal"},
                            render:
                                () =>
                                    <TabPane>
                                        <Table definition celled structured>
                                            <TableBody>
                                                <MultiChoice
                                                    placeholder={"Scenario"}
                                                    options={this.state.scenario_list}
                                                    multiple={false}
                                                    value={this.state.scenario}
                                                    onChange={this.handleScenarioChange.bind(this)}
                                                />
                                            </TableBody>
                                        </Table>
                                    </TabPane>
                        }
                    ]}
                />
                <SortConfigure
                    sort_list={this.state.sort_list}
                    sort_policy={this.state.sort_policy}
                    handleSortChange={this.handleSortChange.bind(this)}
                    // check_precondition_of_fetch_laptops={this.check_precondition_of_fetch_laptops.bind(this)}
                    handleQueryClick={this.handleQueryClick.bind(this)}
                />
                <ShowLaptops
                    page_number={this.state.page_number}
                    item_per_page={this.state.item_per_page}
                    laptop_list={this.state.laptop_list}
                    handlePageChange={this.handlePageChange.bind(this)}
                />
            </div>
        )
    }

    fetch_props() {
        const text = {};
        const send = JSON.stringify(text);
        fetch(this.__props_link, {
            method: "POST",
            headers: {"Content-Type": "application/json; charset=utf-8"},
            body: send,
        }).then(res => res.json()).then(data => {
            this.setState({
                cpu_list: data["cpu"],
                memory_list: data["memory"],
                ssd_list: data["ssd"],
                hdd_list: data["hdd"],
                price_interval_list: data["price_interval"],
                brand_list: data["brand"],
                video_card_list: data["video_card"],
                video_memory_list: data["video_memory"],
                screen_resolution_list: data["screen_resolution"],
                screen_size_list: data["screen_size"],
                sort_list: data["sort"],
                scenario_list: data["scenario"]
            });
        });
    }

    handleQueryClick() {
        console.log(this.state.activeIndex);
        if (this.state.activeIndex === 0) {
            this.fetch_laptops();
        } else if (this.state.activeIndex === 1) {
            this.fetch_recommendation();
        }
    }

    check_precondition_of_fetch_laptops() {
        const state = this.state;
        return !(state.cpu.length === 0 && state.video_card.length === 0 && state.video_memory.length === 0
            && state.memory.length === 0 && state.ssd.length === 0 && state.hdd.length === 0
            && state.brand.length === 0 && state.screen_resolution.length === 0 && state.screen_size.length === 0
            && state.price_interval.length === 0
        )
    }

    fetch_laptops() {
        if (!this.check_precondition_of_fetch_laptops()) {
            window.alert("请至少选择一个属性");
            return;
        }
        const state = this.state;
        const text = {
            brand: state.brand,
            cpu: state.cpu,
            memory: state.memory,
            ssd: state.ssd,
            hdd: state.hdd,
            price_interval: state.price_interval,
            video_card: state.video_card,
            video_memory: state.video_memory,
            screen_size: state.screen_size,
            screen_resolution: state.screen_resolution,
            sort_policy: state.sort_policy,
            reverse: state.reverse,
        };
        const send = JSON.stringify(text);
        fetch(this.__laptops_link, {
            method: "POST",
            headers: {"Content-Type": "application/json; charset=utf-8"},
            body: send,
        }).then(res => res.json()).then(data => {
            this.setState({
                laptop_list: data
            });
        });
    }

    check_precondition_of_fetch_recommendation() {
        const state = this.state;
        return !(state.scenario.length === 0)
    }

    fetch_recommendation() {
        if (!this.check_precondition_of_fetch_recommendation()) {
            window.alert("请至少选择一个选项");
            return;
        }
        const state = this.state;
        const text = {
            scenario: state.scenario,
            sort_policy: state.sort_policy,
            reverse: state.reverse,
        };
        const send = JSON.stringify(text);
        fetch(this.__recommendation, {
            method: "POST",
            headers: {"Content-Type": "application/json; charset=utf-8"},
            body: send,
        }).then(res => res.json()).then(data => {
            this.setState({
                laptop_list: data
            });
        });
    }

    handlePageChange(e, {activePage}) {
        this.setState({
            page_number: activePage
        });
    }

    handleBrandChange(e, {value}) {
        this.setState({
            brand: value,
        });
    }

    handleCpuChange(e, {value}) {
        this.setState({
            cpu: value,
        });
    }

    handleMemoryChange(e, {value}) {
        this.setState({
            memory: value,
        });
    }

    handleScreenSizeChange(e, {value}) {
        this.setState({
            screen_size: value,
        });
    }

    handleScreenResolutionChange(e, {value}) {
        this.setState({
            screen_resolution: value,
        });
    }

    handleVideoCardChange(e, {value}) {
        this.setState({
            video_card: value,
        });
    }

    handleVideoMemoryChange(e, {value}) {
        this.setState({
            video_memory: value,
        });
    }

    handlePriceIntervalChange(e, {value}) {
        this.setState({
            price_interval: value,
        });
    }

    handleSsdChange(e, {value}) {
        this.setState({
            ssd: value,
        });
    }

    handleHddChange(e, {value}) {
        this.setState({
            hdd: value,
        });
    }

    handleSortChange(e, {value}) {
        this.setState({
            sort_policy: value,
        });
    }

    handleScenarioChange(e, {value}) {
        this.setState({
            scenario: value
        });
    }

}

export default App;
